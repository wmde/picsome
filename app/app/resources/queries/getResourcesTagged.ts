import { resolver } from "blitz"
import db from "db"

const getResourcesTagged = resolver.pipe(async () => {
  const resources = await db.resource.findMany({
    take: 64,
    include: {
      tags: true,
      license: true,
    },
    where: {
      NOT: { tags: { none: {} } },
    },
  })

  return { resources }
})

export default getResourcesTagged
