import db, { CollectionType } from "db"
import { NotFoundError, paginate, resolver } from "blitz"
import { z } from "zod"

export const getCollectionResourcesSchema = z.object({
  collectionId: z.number(),
  excludeReported: z.boolean().optional(),
  skip: z.number().optional(),
  take: z.number().optional(),
  maxTake: z.number().optional(),
})

const getCollectionResources = resolver.pipe(
  resolver.zod(getCollectionResourcesSchema),
  async (input, ctx) => {
    // TODO: This would be a wonderful opportunity to cache

    const collection = await db.collection.findUnique({
      where: { id: input.collectionId },
      select: {
        type: true,
        tags: true,
      },
    })

    if (collection === null) {
      throw new NotFoundError("Collection could not be found")
    }

    const include = {
      license: true,
      tags: true,
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

    return paginate({
      skip: input?.skip,
      take: input?.take ?? Number.MAX_SAFE_INTEGER,
      maxTake: input?.maxTake ?? Number.MAX_SAFE_INTEGER,
      count: () => db.resource.count({ where }),
      query: (paginateArgs) =>
        db.resource.findMany({
          ...paginateArgs,
          where,
          include,
        }),
    })
  }
)

export type GetCollectionResourcesInput = z.infer<typeof getCollectionResourcesSchema>
export type CollectionResource = Awaited<ReturnType<typeof getCollectionResources>>["items"][number]
export default getCollectionResources
