import Flickr from "flickr-sdk"
import logger from "../../libs/logger"
import { FlickrAssetInfo, FlickrLicenses } from "./flickr"
import { LicenseResult, Repository, ResourcePreview } from "../../types"
import { ResourceDraft } from "app/check/mutations/createResource"
import { flickerApiKey } from "../../config/secrets"

const flickrLicenses: FlickrLicenses = {
  0: {
    code: "",
    name: "All Rights Reserved",
    url: "",
  },
  1: {
    code: "by-nc-sa",
    name: "Attribution-NonCommercial-ShareAlike License",
    url: "https://creativecommons.org/licenses/by-nc-sa/2.0/",
  },
  2: {
    code: "by-nc",
    name: "Attribution-NonCommercial License",
    url: "https://creativecommons.org/licenses/by-nc/2.0/",
  },
  3: {
    code: "by-nc-nd",
    name: "Attribution-NonCommercial-NoDerivs License",
    url: "https://creativecommons.org/licenses/by-nc-nd/2.0/",
  },
  4: {
    code: "by",
    name: "Attribution License",
    url: "https://creativecommons.org/licenses/by/2.0/",
  },
  5: {
    code: "by-sa",
    name: "Attribution-ShareAlike License",
    url: "https://creativecommons.org/licenses/by-sa/2.0/",
  },
  6: {
    code: "by-nd",
    name: "Attribution-NoDerivs License",
    url: "https://creativecommons.org/licenses/by-nd/2.0/",
  },
  7: {
    code: "flickrcc0",
    name: "No known copyright restrictions",
    url: "https://www.flickr.com/commons/usage/",
  },
  8: {
    code: "usgw",
    name: "United States Government Work",
    url: "http://www.usa.gov/copyright.shtml",
  },
  9: {
    code: "cc0",
    name: "Public Domain Dedication (CC0)",
    url: "https://creativecommons.org/publicdomain/zero/1.0/",
  },
  10: {
    code: "pd",
    name: "Public Domain Mark",
    url: "https://creativecommons.org/publicdomain/mark/1.0/",
  },
}

// Initialize the flickr client with an API KEY
const flickr = new Flickr(flickerApiKey)

/**
 *
 * @param id
 * @returns
 */
export async function getFileInfo(id: string) {
  logger.info(`will fetch file info for ${id}`)
  // TODO: Add Flickr SDK TypeScript types
  const response = await flickr.photos.getInfo({
    photo_id: id,
  })
  return response.body
}

/**
 *
 * @param url
 * @returns
 */
export function extractIdFromURL(url: string): string | undefined {
  const flickrIdRegex =
    url.indexOf("flic.kr") > 0 ? /p\/([0-9a-zA-Z]+)/g : /photos\/[^/]+\/([0-9]+)/g

  // const flickrIdRegex = /photos\/[^/]+\/([0-9]+)/g
  const match = flickrIdRegex.exec(url)

  if (match == null) {
    logger.error("No ID found")
    return undefined
  }

  const id = match[1]

  return id
}

function makeFlickrUrl(fileInfo: any): string {
  // https://www.flickr.com/services/api/misc.urls.html
  // the _b at the end signifies the size, for bigge versions we need a special secret
  const { server, id, secret } = fileInfo
  return `https://live.staticflickr.com/${server}/${id}_${secret}_b.jpg`
}

const getResourceDraft = async (resourceUrl: string): Promise<ResourceDraft | undefined> => {
  // TODO: Needs implementation
  return undefined
}

async function getResourceDraftsForUrl(url: string, limit: number = 20): Promise<ResourceDraft[]> {
  const id = extractIdFromURL(url)

  if (id === undefined) {
    return []
  }

  const fileInfo = await getFileInfo(id)
  logger.info("[flickr] got file info")
  if (fileInfo === null) {
    return []
  }

  const { owner, title, license }: FlickrAssetInfo = fileInfo.photo
  const imgUrl = makeFlickrUrl(fileInfo.photo)
  logger.info("[flickr] licenseid ", license)
  const licenseUrl = flickrLicenses[license].url
  logger.info("[flicker] license url ", licenseUrl)
  const sizeRequest = await flickr.photos.getSizes({
    photo_id: id,
  })
  logger.info("[flickr] got sizes")

  const originalSize = sizeRequest.body.sizes.size.pop()

  const draft: ResourceDraft = {
    resource: {
      authorName: owner.username,
      authorUrl: `https://flickr.com/people/${owner.nsid}/`,
      repository: "flickr",
      title: title._content,
      resourceUrl: url,
      imgUrl,
      thumbUrl: sizeRequest.body.sizes.size.at(-1).source,
      resolutionX: originalSize.width,
      resolutionY: originalSize.height,
      sizeBytes: 0,
    },
    licenseUrl,
  }

  return [draft]
}

const getResourcePreviewsForUrl = async (
  url: string,
  limit: number = 20
): Promise<ResourcePreview[]> => {
  // TODO: Needs implementation
  return []
}

export async function fetchLicense(url: string): Promise<LicenseResult | undefined> {
  logger.log(`fetch License for ${url}`)
  return undefined
}

const flickrRepository: Repository = {
  name: "flickr",
  getResourceDraft,
  getResourceDraftsForUrl,
  getResourcePreviewsForUrl,
}

export default flickrRepository
