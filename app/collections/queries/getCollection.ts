import db, { Resource, Collection, License, Tag } from "db"
import { NotFoundError, resolver } from "blitz"
import { z } from "zod"
import { populateCollections } from "../populateCollections"
import { WikidataItem } from "app/core/services/wikidata"
import { filterVisibleCollectionWhereInput } from "app/reports/shared"

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
  filterVisible: z.boolean().optional(),
  filterVisibleResources: z.boolean().optional(),
})

const getCollection = resolver.pipe(resolver.zod(GetCollectionInput), async (input, ctx) => {
  const { id, takeResources = 3, filterVisible = true, filterVisibleResources = true } = input

  const collection = await db.collection.findFirst({
    where: {
      id,
      AND: [filterVisible ? filterVisibleCollectionWhereInput : {}],
    },
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
        filterVisible: filterVisibleResources,
        take: takeResources,
      },
    },
    ctx
  )

  return populatedCollections[0]!
})

export type GetCollectionInput = z.infer<typeof GetCollectionInput>
export default getCollection
