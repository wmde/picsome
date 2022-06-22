import { NotFoundError, paginate, resolver } from "blitz"
import db, { Prisma } from "db"

export default resolver.pipe(
  async (
    { resourceId, excludeReported = true }: { resourceId: number; excludeReported?: boolean },
    ctx
  ) => {
    const resource = await db.resource.findFirst({
      where: { id: resourceId },
      select: { tags: { select: { wdId: true } } },
    })
    if (resource === null) throw new NotFoundError()
    const { tags } = resource
    const tagWdIds = tags.map((t) => t.wdId)
    const where: Prisma.ResourceWhereInput = {
      tags: { some: { wdId: { in: tagWdIds } } },
      reports: excludeReported
        ? { none: { status: { in: ["Reported", "Pending", "Removed"] } } }
        : undefined,
    }
    const resources = await db.resource.findMany({
      where: where,
      include: {
        license: true,
      },
    })
    return resources.filter((r) => r.id !== resourceId)
  }
)
