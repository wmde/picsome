import { getLocalLabelForWikidataItem, WikidataItem } from "app/core/services/wikidata"
import {
  LicenseFeatureValue,
  LicenseGroupValue,
  Prisma,
  ResourceAspect,
  ResourceFileformat,
  ResourceSize,
} from "db"
import fetch from "node-fetch"
import logger, { loghttpErr } from "integrations/license-check/libs/logger"
import { fetchAgent, isArray, isString } from "integrations/license-check/libs/utils"
import { z } from "zod"
import pos from "pos"
import _ from "lodash"
import { LRU } from "integrations/license-check/libs/cache"
import { ResourceCreateWithoutDetailsWithoutLicenseInput } from "app/check/mutations/createResource"
import createResources from "app/check/mutations/createResources"
const { SEARCH_API_CLIENT_ID, SEARCH_API_CLIENT_SECRET } = process.env
const CCAPIURL = "https://api.openverse.engineering"

class SecretManager {
  clientId: any
  clientSecret: any
  token: string | undefined
  url: URL
  body: URLSearchParams
  expirationTimestamp: number

  constructor(clientId, clientSecret) {
    this.token = undefined
    this.url = new URL("/v1/auth_tokens/token/", CCAPIURL)
    this.body = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    })

    // console.log("BODY", this.body)

    // console.log(new URL("/v1/auth_tokens/token/", CCAPIURL))
  }

  /**
   *
   * curl \
  -X POST \
  -d "client_id=B9sMVenuyYoDhsPx2UmS4ujM3YpwK4TDAamWlYmB&client_secret=BxJnYcWciK1M6XnHETEM7Mej7ROOKhkOgZdGGvEvQt7QlxgNSa4uf4np7SVcRPYOOgdcTNe9CqAX5MSlNh0Dg4IMxVMZ4LGH7pQQMPLuRwcskYvehPctNfb3vAvxMajY&grant_type=client_credentials" \
  "https://api.openverse.engineering/v1/auth_tokens/token/"
   *
   *
   */

  async fetchToken() {
    console.log("requesting new token")

    const res = await fetch(this.url.href, {
      method: "post",
      body: this.body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })

    if (res.ok) {
      console.log("got token")
      const body = await res.json()
      const { access_token, expires_in, token_type } = body

      if (isString(access_token)) {
        this.token = `${token_type} ${access_token}`
        this.expirationTimestamp = Date.now() + 1000 * expires_in
      }
    } else {
      logger.error("Error while fetching token", JSON.stringify(res))
    }
  }

  async getToken() {
    if (!this.token) {
      await this.fetchToken()
    }
    if (Date.now() > this.expirationTimestamp - 60000) {
      await this.fetchToken()
    }
    return this.token
  }
}
export const secretManager = new SecretManager(SEARCH_API_CLIENT_ID, SEARCH_API_CLIENT_SECRET)

const CCResultSchema = z.object({
  title: z.string(),
  id: z.string(),
  creator: z.string().optional(),
  creator_url: z.string().optional().nullable(),
  tags: z.array(z.object({ name: z.string() })).optional(),
  url: z.string(),
  thumbnail: z.string(),
  provider: z.string(), // Or enum? flickr etc_
  source: z.string(), // or enum? "flickr",
  license: z.string(), // or enum? "by-sa",
  license_version: z.string(), // "2.0",
  license_url: z.string().nullable(),
  foreign_landing_url: z.string(),
  detail_url: z.string(),
  related_url: z.string(),
  fields_matched: z.array(z.string()), //  ["description", "tags.name", "title"],
  width: z.number().optional().nullable(),
  height: z.number().optional().nullable(),
})
const CCDetailsSchema = z.object({ width: z.number().optional(), height: z.number().optional() })
type CCResult = z.infer<typeof CCResultSchema>
const CcContextSchema = z.object({
  result_count: z.number(),
  page_count: z.number(),
  page_size: z.number(),
  results: z.array(CCResultSchema),
})

const mapAspect = (aspect: ResourceAspect): string => {
  switch (aspect) {
    case ResourceAspect.Landscape:
      return "wide"
    case ResourceAspect.Portrait:
      return "tall"
    case ResourceAspect.Square:
      return "square"
  }
}
const makeAspectQuery = (
  aspect: ResourceAspect | Prisma.EnumResourceAspectFilter | undefined
): string | undefined => {
  if (aspect === undefined) return
  if (typeof aspect === "string") {
    return mapAspect(aspect)
  } else {
    const filter = aspect as Prisma.EnumResourceAspectFilter
    if (filter.in) {
      if (isArray(filter.in)) {
        return filter.in.map(mapAspect).join(",")
      } else {
        return mapAspect(filter.in)
      }
    }
  }
}
const mapSize = (size: ResourceSize): string => {
  switch (size) {
    case ResourceSize.Big:
      return "large"
    case ResourceSize.Medium:
      return "medium"
    case ResourceSize.Small:
      return "small"
  }
}
const makeSizeQuery = (
  size: ResourceSize | Prisma.EnumResourceSizeFilter | undefined
): string | undefined => {
  if (size === undefined) return
  if (typeof size === "string") {
    return mapSize(size)
  } else {
    const filter = size as Prisma.EnumResourceSizeFilter
    if (filter.in) {
      if (isArray(filter.in)) {
        return filter.in.map(mapSize).join(",")
      } else {
        return mapSize(filter.in)
      }
    }
  }
}
const mapFormat = (format: ResourceFileformat): string => {
  switch (format) {
    case ResourceFileformat.GIF:
      return "gif"
    case ResourceFileformat.JPG:
      return "jpg"
    case ResourceFileformat.SVG:
      return "svg"
    case ResourceFileformat.PNG:
      return "png"
    case ResourceFileformat.Other:
      return ""
  }
}
const makeFormatQuery = (
  format: ResourceFileformat | Prisma.EnumResourceFileformatFilter | undefined
): string | undefined => {
  if (format === undefined) return "jpg,png,gif,svg" // to avoid showing videos etc
  if (typeof format === "string") {
    return mapFormat(format)
  } else {
    const filter = format as Prisma.EnumResourceFileformatFilter
    if (filter.in) {
      if (isArray(filter.in)) {
        return filter.in.map(mapFormat).join(",")
      } else {
        return mapFormat(filter.in)
      }
    }
  }
}
const mapLicenseGroup = (group: LicenseGroupValue): string => {
  // convert CCBYND into BY-ND
  switch (group) {
    case LicenseGroupValue.CC0:
      return "CC0"
    case LicenseGroupValue.PD:
      return "PDM"
    default:
      return _.chunk(group.split(""), 2)
        .slice(1)
        .map(([a, b]) => a + b)
        .join("-")
  }
}
const makeGroupQuery = (groups: Prisma.Enumerable<LicenseGroupValue>): string => {
  if (typeof groups === "string") {
    logger.info("got one group only")
    return mapLicenseGroup(groups)
  } else {
    logger.info("got multipel groups")
    const g = groups.map(mapLicenseGroup).join(",")
    logger.info("G", g)
    return g
  }
}

const mapLicenseFeature = (feature: LicenseFeatureValue): string => {
  // convert CCBYND into BY-ND
  switch (feature) {
    case LicenseFeatureValue.Commercial:
      return "commercial"
    case LicenseFeatureValue.Modify:
      return "modification"
    default:
      return ""
  }
}

const makeFeatureQuery = (features: Prisma.Enumerable<LicenseFeatureValue>): string => {
  if (typeof features === "string") {
    return mapLicenseFeature(features)
  } else {
    return features.map(mapLicenseFeature).join(",")
  }
}

// const fetchAgentCached = new LRU(fetchAgent)
export async function fetchResults(
  items: WikidataItem[],
  details?: Prisma.ResourceDetailsWhereInput,
  licensefeatures?: Prisma.Enumerable<LicenseFeatureValue>,
  licensegroups?: Prisma.Enumerable<LicenseGroupValue>,
  numNouns = 2
): Promise<{ data: ResourceCreateWithoutDetailsWithoutLicenseInput; licenseUrl: string }[]> {
  let nouns: string[] = []

  if (numNouns > 0) {
    const words = new pos.Lexer().lex(items.map((item) => item.description).join(" "))
    const tagger = new pos.Tagger()
    const taggedWords = tagger.tag(words)
    const NOUNTAGS = new Set(["NN", "NNP", "NNS", "NNPS"])
    // We add the first two nouns of the description to the search in the hope of increasing specificity
    // more than 2 nouns seem to be to constrictive though..
    nouns = taggedWords
      .flatMap(([word, tag]) => (NOUNTAGS.has(tag) ? [word] : []))
      .slice(0, numNouns)
  }

  const url = new URL("/v1/images", CCAPIURL)

  url.searchParams.append("q", [...items.map((item) => item.label), ...nouns].join(" "))
  url.searchParams.append("page_size", "24")

  if (details) {
    const { aspect, fileformat, size } = details
    const aspectQuery = makeAspectQuery(aspect)
    if (aspectQuery) {
      url.searchParams.append("aspect_ratio", aspectQuery)
    }
    const sizeQuery = makeSizeQuery(size)
    if (sizeQuery) {
      url.searchParams.append("size", sizeQuery)
    }
    const formatQuery = makeFormatQuery(fileformat)
    if (formatQuery) {
      url.searchParams.append("extension", formatQuery)
    }
  }

  if (licensegroups) {
    const groupQuery = makeGroupQuery(licensegroups)
    url.searchParams.append("license", groupQuery)
  }

  if (licensefeatures) {
    const featureQuery = makeFeatureQuery(licensefeatures)
    url.searchParams.append("license_type", featureQuery)
  }

  console.log("will fetch ", url.toString())
  //const res = await fetchAgentCached.get(url.toString())

  const body = await fetchBodyCached.get(url.toString())

  const result = CcContextSchema.parse(body)

  logger.info(`Found Openverse results: ${result.results.length}`)

  const results = await mapResults(result.results)

  return results
}

const fetchBodyCached = new LRU(async (url: string) => {
  const auth = await secretManager.getToken()
  const res = await fetchAgent(url, auth)

  if (res.ok) {
    return await res.json()
  } else {
    throw new Error(`http error ${res.status} ${url.toString()}`)
  }
})

export async function mapResults(results: CCResult[]) {
  const resourceInputs = await Promise.all(
    results.map(async (r) => {
      const licenseUrl = r.license_url ? r.license_url : ""
      const authorUrl = r.creator_url ? r.creator_url : ""
      let {
        title,
        foreign_landing_url: resourceUrl,
        thumbnail: thumbUrl,
        url: imgUrl,
        width: resolutionX,
        height: resolutionY,
        detail_url,
        provider: repository, // or source??
        creator: authorName = "",
      } = r
      let resXDetails = 0
      let resYDetails = 0
      //if (resolutionX === undefined) {
      /**
       * TODO: THIS IS TOOOOO DAMN CRAZY!
       * We are almost redoing every request. This is not good AT ALL and needs to be optimized
       */
      // const details = await fetchBodyCached.get(detail_url)
      // const detailsParsed = CCDetailsSchema.parse(details)
      // resXDetails = detailsParsed.width ? detailsParsed.width : 150
      // resYDetails = detailsParsed.height ? detailsParsed.height : 150
      //}
      const data: ResourceCreateWithoutDetailsWithoutLicenseInput = {
        title,
        resourceUrl,
        thumbUrl,
        imgUrl,
        authorName,
        authorUrl,
        resolutionX: resolutionX ? resolutionX : resXDetails,
        resolutionY: resolutionY ? resolutionY : resYDetails,
        sizeBytes: 0, // NA in cc search
        repository,
      }
      return { data, licenseUrl }
    })
  )
  return resourceInputs
}

export async function storeResult(resourceInputs, wdIds) {
  await createResources(resourceInputs, wdIds)
  return resourceInputs.map(({ data }) => {
    return data.resourceUrl
  })
}

export async function search(
  wdIds: string[],
  details?: Prisma.ResourceDetailsWhereInput,
  licensefeatures?: Prisma.Enumerable<LicenseFeatureValue>,
  licensegroups?: Prisma.Enumerable<LicenseGroupValue>
) {
  logger.info(`searching ccsearch for ${wdIds.join(", ")}`)

  // If we only want internal results, we can return this
  // return []

  const items = await Promise.all(
    wdIds.map((wdId) => getLocalLabelForWikidataItem({ wdId, language: "en" }))
  )

  //let result = await fetchResults(item, details, licensefeatures, licensegroups, 0)

  // not doing extended search for now
  let result = await fetchResults(items, details, licensefeatures, licensegroups, 0)

  logger.info(`found ${result.length} results for ${items.map((item) => item.label).join(", ")}`)

  // if (result.length < 20) {
  //   logger.info(`got only ${result.length} results will try with less nouns`)
  //   const broaderResult = await fetchResults(item, details, licensefeatures, licensegroups, 1)
  //   result = [...result, ...broaderResult]
  // }

  // if (result.length < 20) {
  //   logger.info(`got only ${result.length} results will try with less nouns`)
  //   const yetBroaderResult = await fetchResults(item, details, licensefeatures, licensegroups, 0)
  //   result = [...result, ...yetBroaderResult]
  // }

  if (result) {
    logger.info(`got results`)
    return await storeResult(result, wdIds)
  }
  logger.info(`got no results`)
  return []
}

function translateDetails(details: Prisma.ResourceDetailsWhereInput) {}
