import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"
import { search } from "integrations/ccsearch/search"
import logger from "integrations/license-check/libs/logger"

type GetResourcesInput = Pick<
  Prisma.ResourceFindManyArgs,
  "where" | "orderBy" | "skip" | "take"
> & {
  curated?: boolean
  wdIds?: string[]
  excludeReported?: boolean
}

export default resolver.pipe(
  async ({
    where: whereInput = {},
    curated = false,
    orderBy = [],
    skip = 0,
    take = 100,
    wdIds = undefined,
    excludeReported = true,
  }: GetResourcesInput) => {
    const details = whereInput.details as Prisma.ResourceDetailsWhereInput
    const { license } = whereInput
    const featureFilter = license?.group?.features?.some?.id as Prisma.EnumLicenseFeatureValueFilter
    const { in: features } = featureFilter || {}
    const groupsFilter = license?.group?.id as Prisma.EnumLicenseGroupValueFilter
    const { in: groups } = groupsFilter || {}
    let ccResultUrls: string[] = []

    if (wdIds && wdIds?.length > 0 && !curated) {
      try {
        ccResultUrls = await search(wdIds, details, features, groups)
      } catch (e) {
        logger.error(`couldnt fetch search results ${e}`)
      }
    }

    const where: Prisma.ResourceWhereInput = {
      OR: [
        {
          AND: ([] as Prisma.ResourceWhereInput[])
            .concat([whereInput])
            .concat(wdIds?.map((wdId) => ({ tags: { some: { wdId } } })) || []),
        },
        {
          resourceUrl: { in: ccResultUrls },
        },
      ],
      AND: [
        {
          reports: excludeReported
            ? { none: { status: { in: ["Reported", "Pending", "Removed"] } } }
            : undefined,
        },
      ],
    }

    const resources = await db.resource.findMany({
      where,
      include: { license: true, tags: true },
    })

    return resources
  }
)
