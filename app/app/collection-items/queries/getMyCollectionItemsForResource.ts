import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const GetMyCollectionItemsForResource = z.object({
  resourceId: z.number(),
})

export default resolver.pipe(
  resolver.zod(GetMyCollectionItemsForResource),
  resolver.authorize(),
  async ({ resourceId }, ctx) => {
    const { userId } = ctx.session
    return db.collectionItem.findMany({
      where: {
        resourceId,
        userId,
      },
    })
  }
)
