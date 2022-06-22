import { resolver } from "blitz"
import { getResourcePreviewsForUrl } from "integrations/license-check/check"
import { z } from "zod"

export const createResourcePreviewsForUrlSchema = z.object({
  url: z.string(),
  limit: z.number().optional(),
})

export default resolver.pipe(resolver.zod(createResourcePreviewsForUrlSchema), async (input) => {
  const { url, limit } = input
  return getResourcePreviewsForUrl(url, limit)
})
