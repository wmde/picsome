import { paginate, resolver } from "blitz"
import db, { Prisma, Resource, WikidataItem } from "db"
import {
  PopulateCollectionResourcesInput,
  populatePaginatedCollections,
} from "./populateCollections"

interface GetCollectionsInput
  extends Pick<Prisma.CollectionFindManyArgs, "where" | "orderBy" | "skip" | "take"> {
  collectionResourcesInput?: PopulateCollectionResourcesInput
}

export default resolver.pipe(async (input: GetCollectionsInput) => {
  const paginatedCollections = await paginate({
    skip: input.skip,
    take: input.take || 100,
    count: () => db.collection.count({ where: input.where }),
    query: (paginateArgs) =>
      db.collection.findMany({
        ...paginateArgs,
        where: input.where,
        include: {
          tags: { include: { labels: true } },
        },
        orderBy: input.orderBy,
      }),
  })
  return {
    paginatedCollections,
    collectionResourcesInput: input.collectionResourcesInput,
  }
}, populatePaginatedCollections)
