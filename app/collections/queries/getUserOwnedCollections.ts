import getCollections from "./getCollections"
import { CollectionType } from "@prisma/client"
import { resolver } from "blitz"
import { z } from "zod"
import { populateCollectionResourcesSchema } from "../populateCollections"

const getUserOwnedCollectionsSchema = z
  .object({
    skip: z.number().optional(),
    take: z.number().optional(),
    collectionResourcesInput: populateCollectionResourcesSchema.optional(),
  })
  .optional()

export default resolver.pipe(
  resolver.zod(getUserOwnedCollectionsSchema),
  resolver.authorize(),
  async (input = {}, ctx) => {
    const { userId } = ctx.session
    return {
      where: {
        userId,
        type: { in: [CollectionType.PrivateCollection, CollectionType.JointCollection] },
      },
      ...input,
    }
  },
  getCollections
)
