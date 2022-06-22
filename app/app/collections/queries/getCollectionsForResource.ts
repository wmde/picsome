import db from "db"
import { paginate, resolver } from "blitz"
import { populatePaginatedCollections } from "./populateCollections"
import { z } from "zod"

const GetCollectionsForResourceInput = z.object({
  resourceId: z.number(),
  skip: z.number().optional(),
  take: z.number().optional(),
  maxTake: z.number().optional(),
})

export default resolver.pipe(
  resolver.zod(GetCollectionsForResourceInput),
  async (input, ctx) => {
    const where = { items: { some: { resourceId: input.resourceId } } }
    const paginatedCollections = await paginate({
      skip: input?.skip,
      take: input?.take || 100,
      maxTake: input?.maxTake,
      count: () => db.collection.count({ where }),
      query: (paginateArgs) =>
        db.collection.findMany({
          ...paginateArgs,
          where,
          include: {
            tags: { include: { labels: true } },
          },
        }),
    })
    return { paginatedCollections }
  },
  populatePaginatedCollections
)
