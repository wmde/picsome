import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const deleteCollectionItemSchema = z.object({
  resourceId: z.number(),
  collectionId: z.number(),
})

export default resolver.pipe(
  resolver.zod(deleteCollectionItemSchema),
  resolver.authorize(),
  async (input, ctx) => {
    const { userId } = ctx.session
    await db.collectionItem.deleteMany({
      where: {
        userId: userId,
        resourceId: input.resourceId,
        collectionId: input.collectionId,
      },
    })
  }
)
