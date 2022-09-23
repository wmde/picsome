import { resolver } from "blitz"
import db from "db"

export const getTagsQuery = async (resourceId: number) => {
  return await db.tag.findMany({
    where: { resourceId },
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

export default resolver.pipe(async ({ resourceId }) => {
  return await getTagsQuery(resourceId)
})
