import db from "db"
import getCollection from "../queries/getCollection"
import { resolver } from "blitz"
import { z } from "zod"

const deleteCollectionInputSchema = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(deleteCollectionInputSchema),
  resolver.authorize(),
  async ({ id }, ctx) => {
    const session = ctx.session

    // Get collection
    const collection = await getCollection({ id, takeResources: 0 }, ctx)

    // Authorization
    if (collection.userId !== session.userId && !session.$isAuthorized(["ADMIN"])) {
      throw new Error("Only ADMIN users may delete collections created by other users")
    }

    await db.collection.deleteMany({ where: { id } })
    return true
  }
)
