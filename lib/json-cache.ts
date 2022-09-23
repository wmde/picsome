import fs from "fs"
import path from "path"
import { z } from "zod"

const localJsonFileCacheMap = new Map<string, { content: any; fetchTime: number }>()

/**
 * Read a local JSON file and parse the contents into an object.
 * Revalidate the content after the cache lifetime is reached.
 *
 * @return The parsed content of the JSON file
 */
export const readAndCacheLocalJsonFile = async <T extends z.ZodTypeAny>(
  filePath: string,
  schema: T,
  cacheLifetime: number = 1000 * 60 * 60
): Promise<z.infer<T> | null> => {
  const resolvedFilePath = path.resolve(filePath)
  const cacheEntry = localJsonFileCacheMap.get(resolvedFilePath)
  const now = new Date().getTime()
  if (cacheEntry !== undefined && now < cacheEntry.fetchTime + cacheLifetime) {
    return cacheEntry.content
  }
  let content: z.infer<typeof schema>
  try {
    const json = fs.readFileSync(resolvedFilePath).toString("utf8")
    return schema.parse(JSON.parse(json))
  } catch (error) {
    content = null
  }
  localJsonFileCacheMap.set(resolvedFilePath, { content, fetchTime: now })
  return content
}
