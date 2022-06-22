import flickrRepository from "./repositories/flickr"
import logger from "./libs/logger"
import wikimediaRepository from "./repositories/wikimedia"
import { Repository, ResourcePreview } from "./types"
import { isUrl } from "./libs/utils"
import { ResourceDraft } from "app/check/mutations/createResource"

/**
 * Object mapping domains to repository instances.
 */
const domainRepositoryMap: { [name: string]: Repository } = {
  "flic.kr": flickrRepository,
  "flickr.com": flickrRepository,
  "wikimedia.org": wikimediaRepository,
}

/**
 * Choose a repository for the given url. Prefer more specific (longer) domain
 * names over the more generic ones.
 * @param url Url to be checked for resources
 * @returns Repository, if any
 */
export const getRepositoryFromUrl = (url: string): Repository | undefined => {
  const domainParts = new URL(url).hostname.split(".")
  let repository: Repository | undefined
  let i = domainParts.length
  while (repository === undefined && i > 0) {
    const partialDomain = domainParts.slice(-i).join(".")
    if (domainRepositoryMap[partialDomain] !== undefined) {
      repository = domainRepositoryMap[partialDomain]
    }
    --i
  }
  return repository
}

/**
 * Retrieve a single resource draft from the given resource url.
 * @param url Resource url
 * @returns Resource draft, if any
 */
export async function getResourceDraft(resourceUrl: string): Promise<ResourceDraft | undefined> {
  if (!isUrl(resourceUrl)) {
    return undefined
  }
  const repository = getRepositoryFromUrl(resourceUrl)
  if (repository === undefined) {
    logger.error(`Repository for url '${resourceUrl}' not found`)
    return undefined
  }
  logger.info(`Asking repository ${repository.name} to get the resource draft of ${resourceUrl}`)
  return repository.getResourceDraft(resourceUrl)
}

/**
 * Retrieve resource drafts from the given url.
 * @param url Url to retrieve resources from
 * @param limit Limit the result set to the given number of items
 * @returns Array of resource drafts
 */
export async function getResourceDraftsForUrl(
  url: string,
  limit: number = -1
): Promise<ResourceDraft[]> {
  if (!isUrl(url)) {
    return []
  }
  const repository = getRepositoryFromUrl(url)
  if (repository === undefined) {
    logger.error(`Repository for url '${url}' not found`)
    return []
  }
  logger.info(
    `Asking repository ${repository.name} to gather at most ${limit} resource draft(s) for ${url}`
  )
  const drafts = await repository.getResourceDraftsForUrl(url, limit)
  logger.info(
    `Repository ${repository.name} returned ${drafts.length} resource draft(s) for ${url}`
  )
  return drafts
}

/**
 * Retrieve resource previews from the given url.
 * @param url Url to retrieve resources from
 * @param limit Limit the result set to the given number of items
 * @returns Array of resource previews
 */
export async function getResourcePreviewsForUrl(
  url: string,
  limit: number = 50
): Promise<ResourcePreview[]> {
  if (!isUrl(url)) {
    return []
  }
  const repository = getRepositoryFromUrl(url)
  if (repository === undefined) {
    logger.error(`Repository for url '${url}' not found`)
    return []
  }
  logger.info(
    `Asking repository ${repository.name} to gather at most ${limit} resource preview(s) for ${url}`
  )
  const previews = await repository.getResourcePreviewsForUrl(url, limit)
  logger.info(
    `Repository ${repository.name} returned ${previews.length} resource preview(s) for ${url}`
  )
  return previews
}
