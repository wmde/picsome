import db from "db"
import { resolver } from "blitz"
import { filterVisibleResourceWhereInput } from "app/reports/shared"

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
        AND: [filterVisibleResourceWhereInput],
      },
    })
  }
)

export default getUserExportableTaggedResources
