import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteCollection = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteCollection),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const collection = await db.collection.deleteMany({ where: { id } })

    return collection
  }
)
