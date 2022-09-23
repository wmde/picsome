import getCollections from "./getCollections"
import { CollectionType } from "@prisma/client"
import { resolver } from "blitz"
import { z } from "zod"
import { populateCollectionResourcesSchema } from "../populateCollections"

const getUserJoinedCollectionsSchema = z
  .object({
    skip: z.number().optional(),
    take: z.number().optional(),
    collectionResourcesInput: populateCollectionResourcesSchema.optional(),
  })
  .optional()

export default resolver.pipe(
  resolver.zod(getUserJoinedCollectionsSchema),
  resolver.authorize(),
  async (input = {}, ctx) => {
    const { userId } = ctx.session
    return {
      where: {
        userId: { not: userId },
        collectors: { some: { id: userId } },
        type: CollectionType.JointCollection,
      },
      ...input,
    }
  },
  getCollections
)
