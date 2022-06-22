import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"
import { z } from "zod"

const GetTagsInput = z.object({
  // This accepts type of undefined, but is required at runtime
  resourceId: z.number().optional().refine(Boolean, "Required"),
})

export const getMyTagsQuery = async (resourceId: number, userId: number) => {
  return await db.tag.findMany({
    where: { resourceId, userId },
    select: {
      id: true,
      label: true,
      description: true,
      wdId: true,
      resourceId: true,
      userId: true,
      wikidataItemWdId: true,
    },
  })
}
export default resolver.pipe(resolver.authorize(), async ({ resourceId }, ctx) => {
  const { userId } = ctx.session
  return await getMyTagsQuery(resourceId, userId)
})
