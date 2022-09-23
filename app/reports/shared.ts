import { Prisma, ReportStatus } from "db"

/**
 * Report statuses that will cause a resource or collection to be hidden from
 * regular users.
 */
export const hiddenItemReportStatuses: ReportStatus[] = ["Pending", "Removed"]

/**
 * Resource where input to be applied to filter visible resources.
 */
export const filterVisibleResourceWhereInput: Prisma.ResourceWhereInput = {
  reports: { none: { status: { in: hiddenItemReportStatuses } } },
}

/**
 * Collection where input to be applied to filter visible collections.
 */
export const filterVisibleCollectionWhereInput: Prisma.CollectionWhereInput = {
  reports: { none: { status: { in: hiddenItemReportStatuses } } },
}
