import { LRU } from "./libs/cache"
import logger from "./libs/logger"
import { fetchAgent } from "./libs/utils"
import config from "./config/repositories"

const getAssetsCached = new LRU<ReturnType<typeof getAssets>>(getAssets)

export type Assets = any[] | any

export async function checkWikipedia(url: string): Promise<Assets> {
  return await getAssetsCached.get(url)
}

export async function getAssets(url: string): Promise<any | undefined> {
  logger.info("calling getAssets for Wikipedia Pages", url)

  const filesRequest = await fetchAgent(`${config.wiki}/files/${encodeURIComponent(url)}`)
  if (filesRequest.ok) {
    const files = await filesRequest.json()
    const cleanedFiles = files.filter((file: any) => {
      return file.fileSize > 1000
    })
    return cleanedFiles
  } else {
    logger.error("Wikipedia Asset Request Failed: ", filesRequest)
    logger.warn("Failed URL", `${config.wiki}/files/${encodeURIComponent(url)}`)
    return undefined
  }
}
