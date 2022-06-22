import db, { Resource, Collection, License, Tag } from "db"
import { NotFoundError, resolver } from "blitz"
import { z } from "zod"
import { populateCollections } from "./populateCollections"
import { WikidataItem } from "app/core/services/wikidata"

export type CollectionWithResources = Collection & {
  resources: (Resource & {
    license: License
    tags: Tag[]
  })[]
  count: number
  tags: WikidataItem[]
}

const GetCollectionInput = z.object({
  id: z.number(),
  takeResources: z.number().optional(),
  excludeReportedResources: z.boolean().optional(),
})

const getCollection = resolver.pipe(
  resolver.zod(GetCollectionInput),
  async ({ id, takeResources = 3, excludeReportedResources = true }, ctx) => {
    // Retrieve collection itself
    const collection = await db.collection.findFirst({
      where: { id },
      include: {
        tags: { include: { labels: true } },
      },
    })
    if (collection === null) {
      throw new NotFoundError()
    }

    const populatedCollections = await populateCollections(
      {
        collections: [collection],
        collectionResourcesInput: {
          excludeReported: excludeReportedResources,
          take: takeResources,
        },
      },
      ctx
    )

    return populatedCollections[0]!
  }
)

export type GetCollectionInput = z.infer<typeof GetCollectionInput>
export default getCollection
