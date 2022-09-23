import getCollections, { GetCollectionsInput } from "app/collections/queries/getCollections"
import { resolver } from "blitz"
import { z } from "zod"

const getSearchCollectionsInputSchema = z.object({
  wikidataIds: z.array(z.string()),
  take: z.number().min(1).max(100).optional(),
  skip: z.number().min(0).optional(),
})

const getSearchCollections = resolver.pipe(
  resolver.zod(getSearchCollectionsInputSchema),
  async (input, ctx) => {
    // Validate wikidataIds
    if (input.wikidataIds.length === 0) {
      throw new Error("Void search is not allowed")
    }

    // Build input for get collections
    const getCollectionsInput: GetCollectionsInput = {
      where: {
        AND: input.wikidataIds.map((wdId) => ({
          items: { some: { resource: { tags: { some: { wdId } } } } },
        })),
      },
      orderBy: { id: "asc" },
      take: input.take ?? 30,
      skip: input.skip ?? 0,
      collectionResourcesInput: {
        filterVisible: true,
        take: 3,
      },
    }

    return getCollectionsInput
  },
  getCollections
)

export default getSearchCollections
export type GetSearchCollectionsInput = z.infer<typeof getSearchCollectionsInputSchema>
