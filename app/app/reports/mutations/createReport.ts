import { resolver } from "blitz"
import db, { ReportReason } from "db"
import { z } from "zod"
import ReportMailer from "../../../mailers/reportMailer"

export const CreateReportSchema = z.object({
  reason: z.nativeEnum(ReportReason),
  message: z.string(),
  resourceId: z.number(),
})

export default resolver.pipe(
  resolver.zod(CreateReportSchema),
  // resolver.authorize(), // TODO can unauthorized create reports?
  async (input, ctx) => {
    const { userId = null } = ctx.session
    const report = await db.report.create({ data: { ...input, userId } })

    await ReportMailer.send({ ...input })

    return report
  }
)
