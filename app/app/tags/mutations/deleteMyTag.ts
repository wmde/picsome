import { resolver } from "blitz"
import db from "db"
import { z } from "zod"
import { getMyTagsQuery } from "../queries/getMyTags"

const DeleteTag = z.object({
  id: z.number(),
  resourceId: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteTag),
  resolver.authorize(),
  async ({ id, resourceId }, ctx) => {
    const { userId } = ctx.session
    await db.tag.deleteMany({ where: { id, userId } })
    return await getMyTagsQuery(resourceId, userId)
  }
)
