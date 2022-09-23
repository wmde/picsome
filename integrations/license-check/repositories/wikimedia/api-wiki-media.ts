import logger from "integrations/license-check/libs/logger"
import { AuthorAndLicense } from "integrations/license-check/types"
import { LRU } from "integrations/license-check/libs/cache"
import { fetchAgent, fetchJsonData } from "integrations/license-check/libs/utils"
import { z } from "zod"

const wikiMediaImageInfoSchema = z.object({
  timestamp: z.string(),
  user: z.string(),
  userid: z.number(),
  size: z.number(),
  width: z.number(),
  height: z.number(),
  canonicaltitle: z.string(),
  thumburl: z.string(),
  thumbwidth: z.number(),
  thumbheight: z.number(),
  responsiveUrls: z.record(z.string()).optional(),
  url: z.string(),
  descriptionurl: z.string(),
  descriptionshorturl: z.string(),
})

const wikiMediaPageSchema = z.object({
  pageid: z.number(),
  title: z.string(),
  imagerepository: z.string().optional(),
  imageinfo: z.array(wikiMediaImageInfoSchema).length(1).optional(),
  wbentityusage: z.record(z.object({})).optional(),
})

export type WikiMediaPage = z.infer<typeof wikiMediaPageSchema>
export type WikiMediaImage = Required<Pick<WikiMediaPage, "imageinfo">> & WikiMediaPage

/**
 * Translate a MediaWiki image resource url to an image object.
 * The image object is returned from the cache, if available.
 * @param resourceUrl MediaWiki resource url
 */
export const fetchWikiMediaImageByResourceUrl = async (resourceUrl: string) => {
  if (mediaWikiImageCache.has(resourceUrl)) {
    return mediaWikiImageCache.get(resourceUrl)
  }
  const { imagePages } = await fetchWikiMediaPagesByUrl(resourceUrl)
  if (imagePages.length !== 1) {
    throw new Error(`MediaWiki resource url '${resourceUrl}' cannot be opened.`)
  }
  return imagePages[0]
}

const mediaWikiImageCache = new LRU<WikiMediaImage>(fetchWikiMediaImageByResourceUrl, 1000)

/**
 * Translate a MediaWiki page url to a set of image and page objects.
 * @param url MediaWiki page url
 */
export const fetchWikiMediaPagesByUrl = async (
  url: string
): Promise<{
  imagePages: WikiMediaImage[]
  subPages: WikiMediaPage[]
}> => {
  // Retrieve the page title given the MediaWiki url. Assume the page title is
  // the 'title' query param or in the last segment of the pathname
  const parsedUrl = new URL(url)

  let title: string | undefined
  if (parsedUrl.searchParams.has("title")) {
    title = parsedUrl.searchParams.get("title") as string
  } else if (parsedUrl.pathname.startsWith("/wiki/")) {
    title = decodeURI(parsedUrl.pathname.substring("/wiki/".length))
  }

  if (title === undefined || title.length === 0) {
    return { imagePages: [], subPages: [] }
  }

  // Compose endpoint URL relative to the given resource url
  // TODO: Security: Make sure no local resources are exposed as the hostname is not trusted
  const apiEndpoint = new URL("/w/api.php", parsedUrl)

  // Configure MediaWiki API call to include necessary image details
  apiEndpoint.searchParams.set("action", "query")
  apiEndpoint.searchParams.set("prop", "imageinfo|wbentityusage")
  apiEndpoint.searchParams.set("iiprop", "timestamp|user|userid|url|canonicaltitle|size")
  apiEndpoint.searchParams.set("iiurlwidth", "600")
  apiEndpoint.searchParams.set("format", "json")

  if (/^File:/i.test(title)) {
    // Single image page
    apiEndpoint.searchParams.set("titles", title)
  } else if (/^Category:/i.test(title)) {
    // Category of images and pages
    apiEndpoint.searchParams.set("generator", "categorymembers")
    apiEndpoint.searchParams.set("gcmtitle", title)
    apiEndpoint.searchParams.set("gcmlimit", "500") // 500 is the upper limit
  } else {
    // Page of images
    apiEndpoint.searchParams.set("generator", "images")
    apiEndpoint.searchParams.set("titles", title)
    apiEndpoint.searchParams.set("gimlimit", "500") // 500 is the upper limit
  }

  // Send out request for resources
  const response = await fetchAgent(apiEndpoint.href)
  if (response.status !== 200) {
    return { imagePages: [], subPages: [] }
  }

  // Parse response
  let pages: unknown[]
  try {
    const responseData = await response.json()
    const rawPages = responseData?.query?.pages ?? {}
    if (typeof rawPages !== "object") {
      throw new Error(`Expected query.pages to be of type object but found ${typeof rawPages}`)
    }
    pages = Object.values(rawPages)
  } catch (error) {
    logger.error(`Received invalid WikiMedia response: ${error.message}`)
    return { imagePages: [], subPages: [] }
  }

  // Parse and gather embedded images and sub pages
  // Sub pages are e.g. sub categories of a category. They are unused right now,
  // but could be traversed for images, too.
  const imagePages: WikiMediaImage[] = []
  const subPages: WikiMediaPage[] = []
  for (const rawPage of pages) {
    try {
      const page = wikiMediaPageSchema.parse(rawPage)
      if (page.imageinfo !== undefined) {
        const image = page as WikiMediaImage
        imagePages.push(image)
        mediaWikiImageCache.put(image.imageinfo[0]!.descriptionurl, image)
      } else {
        subPages.push(page)
      }
    } catch (error) {
      logger.error(
        `Received WikiMedia page object that is not following the schema: ${error.message}`
      )
    }
  }

  logger.info(`Received ${imagePages.length} image(s) and ${subPages.length} sub page(s)`)

  return { imagePages, subPages }
}

export const getAuthorAndLicenseFromWikiMediaEntityUrl = async (
  entityId: string,
  relativeUrl: string
): Promise<Partial<AuthorAndLicense> | undefined> => {
  // Fetch entity
  const entityUrl = new URL(`/wiki/Special:EntityData/${entityId}`, relativeUrl).href
  const entityResponse = await fetchJsonData(entityUrl)
  if (entityResponse === undefined || typeof entityResponse.entities[entityId] === "undefined") {
    logger.info(`Could not fetch MediaWiki entity data for ${entityId}`)
    return undefined
  }

  const entity = entityResponse.entities[entityId]

  // Read author name and url from the P170 entity attribute qualifiers P2093 and P2699
  const authorQualifiers = entity.statements?.P170?.[0]?.qualifiers
  const authorName = readEntityObjectQualifier(authorQualifiers, "P2093")
  const authorUrl = readEntityObjectQualifier(authorQualifiers, "P2699")
  if (authorName === undefined || authorUrl === undefined) {
    logger.info(`No author meta data found for ${entityId}`)
  }

  // Fetch license entity
  let licenseUrl: string | undefined
  const licenseId = readEntityObjectId(entity.statements, "P275")
  if (licenseId !== undefined) {
    const licenseEntityUrl = new URL(`/wiki/Special:EntityData/${licenseId}`, relativeUrl).href
    const licenseReponse = await fetchJsonData(licenseEntityUrl)
    if (licenseReponse === undefined || typeof licenseReponse.entities[licenseId] === "undefined") {
      logger.info(`No MediaWiki license entity set for ${entityId}`)
      return undefined
    }

    // Read license url from license entity
    const licenseEntity = licenseReponse.entities[licenseId]
    licenseUrl = licenseEntity.claims?.P856?.[0]?.mainsnak?.datavalue?.value
    if (typeof licenseUrl !== "string") {
      logger.info(`No MediaWiki license meta data found for ${entityId}`)
      return undefined
    }
  } else {
    logger.info(`No MediaWiki license id set for ${entityId}`)
    return undefined
  }

  return { authorName, authorUrl, licenseUrl }
}

const readEntityObjectQualifier = (obj: any | undefined, propId: string): string | undefined =>
  obj?.[propId]?.[0]?.datavalue?.value

const readEntityObjectId = (obj: any | undefined, propId: string): string | undefined =>
  obj?.[propId]?.[0]?.mainsnak?.datavalue?.value?.id
