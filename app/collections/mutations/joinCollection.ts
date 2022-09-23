import db from "db"
import getCollection from "../queries/getCollection"
import { resolver } from "blitz"
import { z } from "zod"

const joinCollectionInputSchema = z.object({
  collectionId: z.number(),
  join: z.boolean().optional(),
})

export default resolver.pipe(
  resolver.zod(joinCollectionInputSchema),
  resolver.authorize(),
  async (input, ctx) => {
    const { collectionId, join } = input
    const { userId } = ctx.session

    const collection = await getCollection({ id: collectionId }, ctx)

    // Make sure action is legal
    if (collection.type !== "JointCollection") {
      throw new Error("A user may only join joint collections")
    }

    // Add or remove user as collector from/to collection, depending on 'join'
    // input variable
    await db.collection.update({
      where: { id: collectionId },
      data: {
        collectors: {
          [join !== false ? "connect" : "disconnect"]: { id: userId },
        },
      },
    })

    return collection
  }
)
