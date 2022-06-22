import { resolver } from "blitz"
import db from "db"

const getUserExportableTaggedResources = resolver.pipe(
  async (input: { userId: number; excludeIds?: number[] }) => {
    const { excludeIds = [], userId } = input
    return db.resource.findMany({
      include: {
        tags: true,
        license: true,
      },
      where: {
        id: { notIn: excludeIds },
        tags: { some: { userId: userId } },
      },
    })
  }
)

export default getUserExportableTaggedResources
