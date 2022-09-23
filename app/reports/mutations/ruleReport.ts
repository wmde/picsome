import { ReportStatus } from "@prisma/client"
import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

export const ruleReportInputSchema = z.object({
  id: z.number(),
  nextStatus: z.nativeEnum(ReportStatus),
  ruling: z.string(),
})

const ruleReport = resolver.pipe(
  resolver.authorize("ADMIN"),
  resolver.zod(ruleReportInputSchema),
  async (input, ctx) => {
    return await db.report.update({
      where: { id: input.id },
      data: {
        status: input.nextStatus,
        ruling: input.ruling,
      },
    })
  }
)

export default ruleReport
