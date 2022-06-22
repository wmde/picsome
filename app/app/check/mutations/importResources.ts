import createCollectionItems from "app/collection-items/mutations/createCollectionItems"
import createResources from "./createResources"
import { ResourceDraft } from "./createResource"
import { getResourceDraft } from "integrations/license-check/check"
import { resolver } from "blitz"
import { z } from "zod"

const importResourcesSchema = z.object({
  resourceUrls: z.array(z.string()).optional(),
  collectionId: z.number().optional(),
})

export default resolver.pipe(
  resolver.zod(importResourcesSchema),
  resolver.authorize(),
  async (input, ctx) => {
    const { resourceUrls = [], collectionId } = input

    // Turn resource urls into resource drafts
    const resourceDrafts: ResourceDraft[] = []
    for (const resourceUrl of resourceUrls) {
      const resourceDraft = await getResourceDraft(resourceUrl)
      if (resourceDraft !== undefined) {
        resourceDrafts.push(resourceDraft)
      }
    }

    // Create resources from resource drafts
    const resources = await createResources(resourceDrafts)

    // Add resources to collection in bulk
    if (collectionId !== undefined) {
      const resourceIds = resources
        .filter((resource) => resource !== undefined)
        .map((resource) => resource!.id)
      await createCollectionItems({ resourceIds, collectionId }, ctx)
    }

    if (resources.length === 0) {
      throw new Error("No resources could be imported.")
    }

    // Return the imported resources
    return resources
  }
)
