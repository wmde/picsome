import { getLocalLabelForWikidataItem, WikidataItem } from "app/core/services/wikidata"
import {
  LicenseFeatureValue,
  LicenseGroupValue,
  ResourceAspect,
  ResourceFileformat,
  ResourceSize,
} from "db"
import fetch from "node-fetch"
import logger from "integrations/license-check/libs/logger"
import { fetchAgent, isString } from "integrations/license-check/libs/utils"
import { z } from "zod"
import pos from "pos"
import _ from "lodash"
import { LRU } from "integrations/license-check/libs/cache"
import { ResourceDraft } from "app/check/mutations/createResource"
import createResources from "app/check/mutations/createResources"
import { PaginatedItems, ResourceFilers } from "app/search/types"
import { LicensedAndTaggedResource } from "app/resources/queries/getResources"
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
  }

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

export const openverseImageSchema = z.object({
  title: z.string(),
  id: z.string(),
  creator: z.string().optional().nullable(),
  creator_url: z.string().optional().nullable(),
  tags: z
    .array(
      z.object({
        name: z.string(),
      })
    )
    .optional(),
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

type OpenverseImage = z.infer<typeof openverseImageSchema>

const openverseImagePageSchema = z.object({
  result_count: z.number(),
  page_count: z.number(),
  page_size: z.number(),
  page: z.number(),
  results: z.array(openverseImageSchema),
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

const makeAspectRatioQueryParameter = (
  aspect: ResourceAspect | ResourceAspect[] | undefined
): string | undefined => {
  if (typeof aspect === "string") {
    return mapAspect(aspect)
  } else if (aspect !== undefined && aspect.length !== 0) {
    return aspect.map(mapAspect).join(",")
  }
  return undefined
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

const makeSizeQueryParameter = (sizes: ResourceSize[] | undefined): string | undefined => {
  if (sizes !== undefined && sizes.length !== 0) {
    return sizes.map(mapSize).join(",")
  }
  return undefined
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

const makeExtensionQueryParameter = (
  formats: ResourceFileformat[] | undefined
): string | undefined => {
  if (formats !== undefined && formats.length !== 0) {
    return formats.map(mapFormat).join(",")
  }
  // Avoid showing videos, etc.
  return "jpg,png,gif,svg"
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

const makeLicenseQueryParameter = (groups: LicenseGroupValue[] | undefined): string | undefined => {
  if (groups !== undefined && groups.length !== 0) {
    return groups.map(mapLicenseGroup).join(",")
  }
  return undefined
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

const makeLicenseTypeQueryParameter = (
  features: LicenseFeatureValue[] | undefined
): string | undefined => {
  if (features !== undefined && features.length !== 0) {
    return features.map(mapLicenseFeature).join(",")
  }
  return undefined
}

const makeSearchQueryParameter = (items: WikidataItem[], numNouns = 2) => {
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
  return [...items.map((item) => item.label), ...nouns].join(" ")
}

export const openverseApiCache = new LRU(async (url: string) => {
  const auth = await secretManager.getToken()
  const res = await fetchAgent(url, auth)
  if (res.ok) {
    return await res.json()
  } else {
    throw new Error(`http error ${res.status} ${url.toString()}`)
  }
})

export const createResourceDraftFromOpenverseImage = (image: OpenverseImage): ResourceDraft => ({
  resource: {
    title: image.title,
    resourceUrl: image.foreign_landing_url,
    thumbUrl: image.thumbnail,
    imgUrl: image.url,
    authorName: image.creator ?? "",
    authorUrl: image.creator_url ? image.creator_url : "",
    repository: image.provider,

    // TODO: the resolution may not be known, fetch it from elsewhere
    resolutionX: image.width ?? 0,
    resolutionY: image.height ?? 0,

    // Not available in Openverse
    sizeBytes: 0,
  },
  licenseUrl: image.license_url ? image.license_url : "",
})

export const searchOpenverse = async (
  wikidataIds: string[],
  filters: ResourceFilers,
  take: number,
  skip: number
): Promise<PaginatedItems<LicensedAndTaggedResource>> => {
  const wikidataItems = await Promise.all(
    wikidataIds.map((wdId) => getLocalLabelForWikidataItem({ wdId, language: "en" }))
  )
  const searchQuery = makeSearchQueryParameter(wikidataItems, 0)

  // Build Openverse query
  const queryUrl = new URL("/v1/images", CCAPIURL)
  queryUrl.searchParams.append("q", searchQuery)

  const sizeParam = makeSizeQueryParameter(filters.sizes)
  if (sizeParam !== undefined) {
    queryUrl.searchParams.append("size", sizeParam)
  }

  const aspectRatioParam = makeAspectRatioQueryParameter(filters.aspects)
  if (aspectRatioParam !== undefined) {
    queryUrl.searchParams.append("aspect_ratio", aspectRatioParam)
  }

  const extensionParam = makeExtensionQueryParameter(filters.fileFormats)
  if (extensionParam !== undefined) {
    queryUrl.searchParams.append("extension", extensionParam)
  }

  const licenseParam = makeLicenseQueryParameter(filters.licenseGroups)
  if (licenseParam !== undefined) {
    queryUrl.searchParams.append("license", licenseParam)
  }

  const licenseTypeParam = makeLicenseTypeQueryParameter(filters.licenseFeatures)
  if (licenseTypeParam !== undefined) {
    queryUrl.searchParams.append("license_type", licenseTypeParam)
  }

  logger.info(`Searching Openverse for '${searchQuery}' with query URL ${queryUrl.href}`)

  let count = 0
  let images: OpenverseImage[] = []

  const pageSize = 200
  const startPage = Math.floor(skip / pageSize) + 1
  const startPageSkip = skip % pageSize
  const endPage = Math.floor((skip + take) / pageSize) + 1

  for (let page = startPage; page <= endPage; page++) {
    const paginatedQueryUrl = new URL(queryUrl)
    paginatedQueryUrl.searchParams.append("page_size", pageSize.toString())
    paginatedQueryUrl.searchParams.append("page", page.toString())

    // Fetch and parse Openverse response
    logger.info(`Fetching Openverse results page ${page}`)
    const rawOpenverseImagePage = await openverseApiCache.get(paginatedQueryUrl.href)
    const openverseImagePage = openverseImagePageSchema.parse(rawOpenverseImagePage)
    const pageImages = openverseImagePage.results

    const skipImages = page === startPage ? startPageSkip : 0
    const takeImages = take - images.length

    images = images.concat(pageImages.slice(skipImages, skipImages + takeImages))
    count = openverseImagePage.result_count
  }

  logger.info(`Found ${count} result(s) in total in Openverse`)

  // Create resource drafts from Openverse image objects
  const drafts = images.map(createResourceDraftFromOpenverseImage)

  // Create or update resources
  const resources = await createResources(drafts)
  logger.info(`${resources.length}/${drafts.length} were successfully created or updated`)

  // Compose paginated result set
  const hasMore = skip + take < count
  return {
    items: resources,
    nextPage: hasMore
      ? {
          take: take,
          skip: skip + take,
        }
      : null,
    hasMore,
    count,
  }
}
