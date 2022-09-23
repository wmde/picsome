import { Repository, ResourcePreview } from "integrations/license-check/types"
import { ResourceDraft } from "app/check/mutations/createResource"
import {
  fetchWikiMediaImageByResourceUrl,
  fetchWikiMediaPagesByUrl,
  getAuthorAndLicenseFromWikiMediaEntityUrl,
  WikiMediaImage,
} from "./api-wiki-media"
import { getAuthorAndLicenseFromAttributionGeneratorApi } from "./api-attribution-generator"
import { logger } from "../../libs/logger"

const getResourceDraft = async (resourceUrl: string): Promise<ResourceDraft | undefined> => {
  const imagePage = await fetchWikiMediaImageByResourceUrl(resourceUrl)
  if (imagePage === undefined) {
    return undefined
  }
  return composeResourceDraftFromImagePage(imagePage)
}

const getResourceDraftsForUrl = async (
  url: string,
  limit: number = 20
): Promise<ResourceDraft[]> => {
  // see PCS-542: Partially encoded URLs yield no results
  url = decodeURIComponent(url)
  const drafts: ResourceDraft[] = []
  const { imagePages } = await fetchWikiMediaPagesByUrl(url)
  for (const imagePage of imagePages) {
    const draft = await composeResourceDraftFromImagePage(imagePage)
    if (draft !== undefined) {
      drafts.push(draft)
      if (drafts.length >= limit) {
        break
      }
    }
  }
  return drafts
}

const getResourcePreviewsForUrl = async (
  url: string,
  limit: number = 20
): Promise<ResourcePreview[]> => {
  const { imagePages } = await fetchWikiMediaPagesByUrl(url)
  return imagePages
    .map((image) => {
      const imageInfo = image.imageinfo!.at(0)!
      return {
        title: stripLeaderAndExtensionFromTitle(image.title),
        resourceUrl: imageInfo.descriptionurl,
        imageUrl: imageInfo.thumburl,
      }
    })
    .slice(0, limit)
}

/**
 * Fetch additional license information for the given WikiMedia image page and
 * compose a resource draft.
 */
const composeResourceDraftFromImagePage = async (
  imagePage: WikiMediaImage
): Promise<ResourceDraft | undefined> => {
  let authorName: string | undefined
  let authorUrl: string | undefined
  let licenseUrl: string | undefined

  // From the schema and the check above we know image info is available
  const imageInfo = imagePage.imageinfo!.at(0)!

  // Try to get license metadata from MediaWiki entity data
  const entityId = Object.keys(imagePage.wbentityusage ?? {}).at(0)
  if (entityId !== undefined) {
    logger.info(
      `Trying to get license metadata from the MediaWiki entity data for ${imagePage.title}`
    )
    const authorAndLicense = await getAuthorAndLicenseFromWikiMediaEntityUrl(
      entityId,
      imageInfo.descriptionurl
    )
    authorName = authorAndLicense?.authorName
    authorUrl = authorAndLicense?.authorUrl
    licenseUrl = authorAndLicense?.licenseUrl
  }

  // Try to get license metadata from attribution generator API
  if (authorName === undefined || authorUrl === undefined || licenseUrl === undefined) {
    logger.info(
      `Trying to get license metadata from the attribution generator API for ${imageInfo.descriptionurl}`
    )
    const authorAndLicense = await getAuthorAndLicenseFromAttributionGeneratorApi(
      imageInfo.descriptionurl
    )
    authorName = authorName ?? authorAndLicense?.authorName
    authorUrl = authorUrl ?? authorAndLicense?.authorUrl
    licenseUrl = licenseUrl ?? authorAndLicense?.licenseUrl
  }

  console.log("hi", authorName, authorUrl, licenseUrl)

  // We require author and license information for the resource to be considered
  if (licenseUrl === undefined) {
    logger.info(`Skipping. No license url available for ${imagePage.title}`)
    return undefined
  }

  logger.info(`Found license url ${licenseUrl}`)

  // Compose resource draft ready to be added to the database
  return {
    resource: {
      // TODO: Change Prisma schema to make author name and url optional
      authorName: authorName ?? "",
      authorUrl: authorUrl ?? "",
      repository: "wikimedia",
      title: stripLeaderAndExtensionFromTitle(imageInfo.canonicaltitle),
      resourceUrl: imageInfo.descriptionurl,
      imgUrl: imageInfo.url,
      thumbUrl: imageInfo.thumburl,
      resolutionX: imageInfo.width,
      resolutionY: imageInfo.height,
      sizeBytes: imageInfo.size,
    },
    licenseUrl,
  }
}

const stripLeaderAndExtensionFromTitle = (title: string): string => {
  return title.replace(/^File:/i, "").replace(/(\.(\w)+)+$/, "")
}

export const attributionApi: Repository = {
  name: "mediawiki",
  getResourceDraft,
  getResourceDraftsForUrl,
  getResourcePreviewsForUrl,
}

export default attributionApi
