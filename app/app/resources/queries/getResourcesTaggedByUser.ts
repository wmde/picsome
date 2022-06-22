import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetResourcesInput extends Pick<Prisma.ResourceFindManyArgs, "skip" | "take"> {
  excludeReported?: boolean
}

export default resolver.pipe(
  resolver.authorize(),
  async ({ skip = 0, take = 100, excludeReported = true }: GetResourcesInput, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const { userId } = ctx.session
    const where: Prisma.ResourceWhereInput = {
      tags: { some: { userId } },
      reports: excludeReported
        ? { none: { status: { in: ["Reported", "Pending", "Removed"] } } }
        : undefined,
    }
    const {
      items: resources,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.resource.count({ where }),
      query: (paginateArgs) =>
        db.resource.findMany({ ...paginateArgs, where, include: { license: true } }),
    })

    return {
      resources,
      nextPage,
      hasMore,
      count,
    }
  }
)
