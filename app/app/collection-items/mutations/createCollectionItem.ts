import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const createCollectionItemSchema = z.object({
  resourceId: z.number(),
  collectionId: z.number(),
})

export default resolver.pipe(
  resolver.zod(createCollectionItemSchema),
  resolver.authorize(),
  async (input, ctx) => {
    const { userId } = ctx.session
    await db.collectionItem.create({
      data: {
        resourceId: input.resourceId,
        collectionId: input.collectionId,
        userId,
      },
    })
  }
)
