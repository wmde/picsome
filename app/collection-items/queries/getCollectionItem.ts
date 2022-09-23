import db from "db"
import { resolver } from "blitz"
import { z } from "zod"

const GetCollectionItem = z.object({
  resourceId: z.number(),
  collectionId: z.number(),
})

export default resolver.pipe(
  resolver.zod(GetCollectionItem),
  resolver.authorize(),
  async ({ resourceId, collectionId }, ctx) => {
    const { userId } = ctx.session
    return db.collectionItem.findFirst({
      where: {
        userId,
        resourceId,
        collectionId,
      },
    })
  }
)
