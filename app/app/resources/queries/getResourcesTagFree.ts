import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetResourcesTagFreeInput
  extends Pick<Prisma.CollectionItemFindManyArgs, "where" | "orderBy" | "skip" | "take"> {
  excludeReported?: boolean
}

export default resolver.pipe(
  async ({ orderBy, skip = 0, take = 100, excludeReported = true }: GetResourcesTagFreeInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant

    const where = {
      resource: { tags: { none: {} } },
    }

    const {
      items: collectionItems,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.collectionItem.count({ where }),
      query: (paginateArgs) =>
        db.collectionItem.findMany({
          ...paginateArgs,
          where,
          orderBy,
          select: { id: true, resource: true },
        }),
    })

    const resources = await Promise.all(
      collectionItems
        .map(async (item) => {
          return db.resource.findFirst({
            where: {
              id: item.resource.id,
              reports: excludeReported
                ? { none: { status: { in: ["Reported", "Pending", "Removed"] } } }
                : undefined,
            },
            include: {
              license: { include: { group: { include: { features: true } } } },
            },
          })
        })
        .filter((resource) => resource !== null)
    )

    return { resources }
  }
)
