import { resolver } from "blitz"
import db from "db"
import { z } from "zod"
import { getMyTagsQuery } from "../queries/getMyTags"

const DeleteTag = z.object({
  id: z.number().optional(),
  wdId: z.string().optional(),
  resourceId: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteTag),
  resolver.authorize(),
  async ({ id, wdId, resourceId }, ctx) => {
    const { userId } = ctx.session
    if (id !== undefined) {
      await db.tag.deleteMany({ where: { id, userId } })
    } else if (wdId !== undefined) {
      await db.tag.deleteMany({ where: { wdId, userId } })
    }
    return await getMyTagsQuery(resourceId, userId)
  }
)
