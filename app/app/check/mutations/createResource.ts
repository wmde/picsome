import db, { Prisma, ResourceAspect, ResourceFileformat, ResourceSize, Resource } from "db"
import fetch from "node-fetch"
import licenses from "../mutations/licenses"
import logger from "integrations/license-check/libs/logger"
import sharp from "sharp"

export type ResourceDraft = {
  data?: any
  resource?: any
  licenseUrl: string
}

export type ResourceCreateWithoutDetailsWithoutLicenseInput = Omit<
  Prisma.ResourceCreateWithoutDetailsInput,
  "license"
>

/**
 * Create or update a resource entity by the given resource draft.
 * Trigger blur data url update async. Return undefined when license is not
 * available or resource could not be created or updated.
 * @param draft Resource draft to create resource from
 * @returns Created or updated resource entity
 */
const createResource = async (draft: ResourceDraft): Promise<Resource | undefined> => {
  /**
   * TODO: We get strange differences here, let's review this
   */
  const { data: resourceData, resource: resourceResource, licenseUrl } = draft

  const resourceContent = resourceData ? resourceData : resourceResource

  const resourceUrl = resourceContent.resourceUrl

  // Retrieve license
  const license = licenses(licenseUrl)
  if (license === undefined) {
    logger.error(`Couldn't read license from url ${licenseUrl}`)
    return undefined
  }

  // Compose resource data
  const detailsData = makeDetailsData(resourceContent)
  const data: Prisma.ResourceCreateInput = {
    ...resourceContent,
    license: {
      connectOrCreate: {
        where: { canonicalUrl: licenseUrl },
        create: license,
      },
    },
    details: { connectOrCreate: detailsData },
  }

  // Create or update resource and return instance
  let resource: Resource
  try {
    resource = await db.resource.upsert({
      where: { resourceUrl },
      update: data,
      create: data,
    })
  } catch (error) {
    logger.error(`Error while creating or updating resource: ${error.message}`)
    return undefined
  }

  logger.info(`Resource created or updated (id: ${resource.id})`)

  // Trigger blur image url rendering in the background without
  // waiting for the promise to resolve
  void updateResourceBlurDataUrl(resource)

  // Return created or updated instance
  return resource
}

export default createResource

/**
 * Update the blur data url for the given resource.
 */
const updateResourceBlurDataUrl = async (resource: Resource) => {
  const thumbUrl = resource.thumbUrl
  const blurDataUrl = await renderBlurDataUrl(thumbUrl)
  if (blurDataUrl !== undefined) {
    try {
      await db.resource.update({
        where: { id: resource.id },
        data: { blurDataUrl },
      })
      logger.info(`Added blur data to resource ${resource.id}`)
    } catch (error) {
      logger.error(`Error while adding blur data to resource ${resource.id}: ${error.message}`)
    }
  }
}

/**
 * Download the image at the given url and render a blur image data url from it.
 */
const renderBlurDataUrl = async (imageUrl: string): Promise<string | undefined> => {
  try {
    const response = await fetch(imageUrl, { method: "GET" })
    if (response.status !== 200) {
      return undefined
    }
    const thumbBuffer = await response.buffer()
    const blurBuffer: Buffer = await sharp(thumbBuffer).resize(10, 10).webp().toBuffer()
    return `data:image/webp;base64,${blurBuffer.toString("base64")}`
  } catch (error) {
    logger.error(`Blur data url could not be rendered for image ${imageUrl}: ${error.message}`)
    return undefined
  }
}

const getFileformat = ({ imgUrl }): ResourceFileformat => {
  const [ending] = imgUrl.split(".").splice(-1)
  if (ending === undefined) return ResourceFileformat.Other
  let cap = ending.toUpperCase()
  if (cap === "JPEG") cap = "JPG"
  if (Object.keys(ResourceFileformat).includes(cap)) {
    return cap as ResourceFileformat
  }
  return ResourceFileformat.Other
}

const getSizeAndAspect = ({
  resolutionX,
  resolutionY,
}): {
  size: ResourceSize
  aspect: ResourceAspect
} => {
  let aspect: ResourceAspect
  if (resolutionX === resolutionY) {
    aspect = ResourceAspect.Square
  } else if (resolutionX > resolutionY) {
    aspect = ResourceAspect.Landscape
  } else {
    aspect = ResourceAspect.Portrait
  }

  const base = aspect === ResourceAspect.Landscape ? resolutionX : resolutionY
  let size: ResourceSize = ResourceSize.Small
  if (base > 1000) {
    size = ResourceSize.Medium
  } else if (base > 2000) {
    size = ResourceSize.Big
  }

  return { size, aspect }
}

const makeDetailsData = (data: Omit<Prisma.ResourceCreateWithoutDetailsInput, "license">) => {
  const fileformat = getFileformat(data)
  const { size, aspect } = getSizeAndAspect(data)
  return {
    where: {
      aspect_fileformat_size: { fileformat, size, aspect },
    },
    create: { fileformat, size, aspect },
  }
}
