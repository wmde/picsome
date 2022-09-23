import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

export const getItemReportsInputSchema = z.union([
  z.object({
    resourceId: z.number(),
  }),
  z.object({
    collectionId: z.number(),
  }),
])

const getItemReports = resolver.pipe(resolver.zod(getItemReportsInputSchema), async (input) => {
  return db.report.findMany({
    where: {
      resourceId: "resourceId" in input ? input.resourceId : undefined,
      collectionId: "collectionId" in input ? input.collectionId : undefined,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
})

export default getItemReports
