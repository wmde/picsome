import { Repository, ResourcePreview } from "../../types"
import { ResourceDraft } from "app/check/mutations/createResource"
import {
  createResourceDraftFromOpenverseImage,
  openverseApiCache,
  openverseImageSchema,
} from "integrations/ccsearch/search"
import logger from "integrations/license-check/libs/logger"

const getResourceDraft = async (resourceUrl: string): Promise<ResourceDraft | undefined> => {
  const imageId = resolveOpenverseImageIdFromUrl(resourceUrl)
  if (imageId === undefined) {
    // Unable to resolve image id from url
    return undefined
  }
  const imageDetailApiUrl = `https://api.openverse.engineering/v1/images/${imageId}/`
  try {
    const rawOpenverseImage = await openverseApiCache.get(imageDetailApiUrl)
    const openverseImage = openverseImageSchema.parse(rawOpenverseImage)
    return createResourceDraftFromOpenverseImage(openverseImage)
  } catch (error) {
    logger.info(`Error while fetching openverse image details: ${error.toString()}`)
    return undefined
  }
}

const resolveOpenverseImageIdFromUrl = (url: string): string | undefined => {
  const pattern =
    /^https?:\/\/(wordpress\.org\/openverse|search\.openverse\.engineering)\/image\/([^\/]+)\/?/i
  const match = url.match(pattern)
  if (match === null) {
    return undefined
  }
  return match[2]
}

const getResourceDraftsForUrl = async (
  url: string,
  limit: number = 20
): Promise<ResourceDraft[]> => {
  // Only urls with single images are supported, fallback to `getResourceDraft`
  const draft = await getResourceDraft(url)
  if (draft !== undefined) {
    return [draft]
  }
  return []
}

const getResourcePreviewsForUrl = async (
  url: string,
  limit: number = 20
): Promise<ResourcePreview[]> => {
  // Only urls with single images are supported, fallback to `getResourceDraft`
  const draft = await getResourceDraft(url)
  if (draft !== undefined) {
    return [
      {
        title: draft.resource.title,
        resourceUrl: draft.resource.resourceUrl,
        imageUrl: draft.resource.imgUrl,
      },
    ]
  }
  return []
}

const openverseRepository: Repository = {
  name: "openverse",
  getResourceDraft,
  getResourceDraftsForUrl,
  getResourcePreviewsForUrl,
}

export default openverseRepository
