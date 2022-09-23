import db, { CollectionType } from "db"
import getResources, { GetResourcesInput } from "./getResources"
import { NotFoundError, resolver } from "blitz"
import { z } from "zod"

export const getCollectionResourcesSchema = z.object({
  collectionId: z.number(),
  /** Wether to exclude hidden resources (true by default) */
  filterVisible: z.boolean().optional(),
  skip: z.number().optional(),
  take: z.number().optional(),
})

const getCollectionResources = resolver.pipe(
  resolver.zod(getCollectionResourcesSchema),
  async (input, ctx) => {
    // TODO: This would be a wonderful opportunity to cache
    const { collectionId, ...getResourcesInput } = input

    const collection = await db.collection.findUnique({
      where: { id: input.collectionId },
      select: { type: true, tags: true },
    })

    if (collection === null) {
      throw new NotFoundError("Collection could not be found")
    }

    let where
    if (collection.type === CollectionType.SmartCollection) {
      // Smart collection query based on tags
      where = {
        AND: collection.tags.map((tag) => ({
          tags: { some: { wdId: tag.wdId } },
        })),
      }
    } else {
      // Collection item based query
      where = {
        items: { some: { collectionId: input.collectionId } },
      }
    }

    return {
      where,
      ...getResourcesInput,
    } as GetResourcesInput
  },
  getResources
)

export type GetCollectionResourcesInput = z.infer<typeof getCollectionResourcesSchema>
export type CollectionResource = Awaited<ReturnType<typeof getCollectionResources>>["items"][number]
export default getCollectionResources
