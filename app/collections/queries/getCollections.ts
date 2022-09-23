import { filterVisibleCollectionWhereInput } from "app/reports/shared"
import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"
import {
  PopulateCollectionResourcesInput,
  populatePaginatedCollections,
} from "../populateCollections"

export interface GetCollectionsInput
  extends Pick<Prisma.CollectionFindManyArgs, "where" | "orderBy" | "skip" | "take"> {
  filterVisible?: boolean
  collectionResourcesInput?: PopulateCollectionResourcesInput
}

export default resolver.pipe(async (input: GetCollectionsInput) => {
  const { filterVisible = true, collectionResourcesInput = {} } = input
  const where: Prisma.CollectionWhereInput = {
    AND: [input.where ?? {}, filterVisible ? filterVisibleCollectionWhereInput : {}],
  }
  const paginatedCollections = await paginate({
    skip: input.skip,
    take: input.take ?? 100,
    count: () => db.collection.count({ where }),
    query: (paginateArgs) =>
      db.collection.findMany({
        ...paginateArgs,
        where,
        include: {
          tags: { include: { labels: true } },
        },
        orderBy: input.orderBy,
      }),
  })
  return {
    paginatedCollections,
    collectionResourcesInput,
  }
}, populatePaginatedCollections)
