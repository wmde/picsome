import getCollectionResources, {
  getCollectionResourcesSchema,
} from "app/resources/queries/getCollectionResources"
import { Collection, WikidataItem, WikidataItemLabel } from "db"
import { Ctx } from "blitz"
import { CollectionWithResources } from "./queries/getCollection"
import { z } from "zod"

export type CollectionWithLabeledTags = Collection & {
  tags: (WikidataItem & {
    labels: WikidataItemLabel[]
  })[]
}

export const populateCollectionResourcesSchema = getCollectionResourcesSchema.omit({
  collectionId: true,
})

export type PopulateCollectionResourcesInput = z.infer<typeof populateCollectionResourcesSchema>

export type PopulateCollectionsInput = {
  collections: CollectionWithLabeledTags[]
  collectionResourcesInput?: PopulateCollectionResourcesInput
}

export const populateCollections = async (input: PopulateCollectionsInput, ctx: Ctx) => {
  const { collections, collectionResourcesInput = {} } = input
  // Request embedded resources in parallel
  return Promise.all(
    collections.map(async (collection) => {
      const paginatedResources = await getCollectionResources(
        {
          ...collectionResourcesInput,
          take: collectionResourcesInput.take || 3,
          collectionId: collection.id,
        },
        ctx
      )
      return {
        ...collection,
        resources: paginatedResources.items,
        count: paginatedResources.count,
        tags: collection.tags.map((tag) => ({
          id: tag.wdId,
          // TODO: Choose the right locale
          label: tag.labels[0]?.label,
          description: tag.labels[0]?.description,
        })),
      }
    })
  ) as Promise<CollectionWithResources[]>
}

export type PopulatePaginatedCollectionsInput = {
  paginatedCollections: {
    items: CollectionWithLabeledTags[]
    nextPage: { take: number; skip: number } | null
    hasMore: boolean
    count: number
  }
  collectionResourcesInput?: PopulateCollectionResourcesInput
}

export const populatePaginatedCollections = async (
  input: PopulatePaginatedCollectionsInput,
  ctx: Ctx
) => {
  const { paginatedCollections, collectionResourcesInput = {} } = input
  return {
    ...paginatedCollections,
    items: await populateCollections(
      {
        collections: paginatedCollections.items,
        collectionResourcesInput,
      },
      ctx
    ),
  }
}
