import { filterVisibleResourceWhereInput } from "app/reports/shared"
import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

export type GetResourcesInput = Pick<
  Prisma.ResourceFindManyArgs,
  "where" | "orderBy" | "skip" | "take"
> & {
  /** Filter resources by the given Wikidata ids (skip by default) */
  filterWikidataIds?: string[]
  /** Wether to exclude hidden resources (true by default) */
  filterVisible?: boolean
}

const getResources = resolver.pipe(async (input: GetResourcesInput) => {
  const { filterVisible = true, filterWikidataIds = [] } = input
  const where: Prisma.ResourceWhereInput = {
    AND: [
      // Apply custom where clause
      input.where ?? {},
      // Apply visible filter
      filterVisible ? filterVisibleResourceWhereInput : {},
      // Apply Wikidata ids filter
      { AND: filterWikidataIds.map((wdId) => ({ tags: { some: { wdId } } })) },
    ],
  }
  return paginate({
    skip: input.skip,
    take: input.take ?? 100,
    count: () => db.resource.count({ where }),
    query: (paginateArgs) =>
      db.resource.findMany({
        ...paginateArgs,
        where,
        include: { license: true, tags: true },
        orderBy: input.orderBy,
      }),
  })
})

export default getResources
export type LicensedAndTaggedResource = Awaited<ReturnType<typeof getResources>>["items"][number]
