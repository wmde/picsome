import getCollections from "./getCollections"
import { CollectionType } from "@prisma/client"
import { resolver } from "blitz"
import { z } from "zod"
import { populateCollectionResourcesSchema } from "../populateCollections"

const getUserSmartCollectionsSchema = z
  .object({
    skip: z.number().optional(),
    take: z.number().optional(),
    collectionResourcesInput: populateCollectionResourcesSchema.optional(),
  })
  .optional()

export default resolver.pipe(
  resolver.zod(getUserSmartCollectionsSchema),
  resolver.authorize(),
  async (input = {}, ctx) => {
    const { userId } = ctx.session
    return {
      where: {
        userId,
        type: CollectionType.SmartCollection,
      },
      ...input,
    }
  },
  getCollections
)
