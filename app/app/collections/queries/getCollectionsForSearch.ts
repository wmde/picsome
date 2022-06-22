import { resolver } from "blitz"
import db, { Prisma } from "db"
import { PopulateCollectionResourcesInput, populateCollections } from "./populateCollections"

interface GetCollectionsInput
  extends Pick<Prisma.CollectionFindManyArgs, "where" | "orderBy" | "skip" | "take"> {
  collectionResourcesInput?: PopulateCollectionResourcesInput
}

const getSearchCollections = resolver.pipe(async (input: GetCollectionsInput, ctx) => {
  const collections = await db.collection.findMany({
    where: input.where,
    include: {
      tags: { include: { labels: true } },
    },
    orderBy: input.orderBy,
  })

  const populatedCollections = await populateCollections(
    {
      collections: collections,
      collectionResourcesInput: {
        excludeReported: true,
        take: 3,
      },
    },
    ctx
  )

  return populatedCollections
})

export default getSearchCollections
