import createResources from "./createResources"
import { getResourceDraftsForUrl } from "integrations/license-check/check"
import { resolver } from "blitz"
import { z } from "zod"

const createResourcesForUrlSchema = z.object({
  resourceUrl: z.string(),
  limit: z.number().optional(),
})

export default resolver.pipe(
  resolver.zod(createResourcesForUrlSchema),
  // Retrieve resource drafts for the given url
  async (input, ctx) => {
    const { resourceUrl, limit } = input
    const resourceDrafts = await getResourceDraftsForUrl(resourceUrl, limit)
    if (resourceDrafts.length === 0) {
      throw new Error("Didn't get any resource back")
    }
    return resourceDrafts
  },
  // Create or update resources for the given drafts
  createResources
)
