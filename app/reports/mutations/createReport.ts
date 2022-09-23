import ReportMailer from "../../../mailers/reportMailer"
import db, { ReportReason } from "db"
import { resolver, Routes } from "blitz"
import { z } from "zod"

export const createReportInputSchema = z.object({
  resourceId: z.number().optional(),
  collectionId: z.number().optional(),
  reason: z.nativeEnum(ReportReason),
  message: z.string(),
})

const createReport = resolver.pipe(resolver.zod(createReportInputSchema), async (input, ctx) => {
  const userId = ctx.session.userId ?? null
  const { resourceId, collectionId, reason, message } = input

  // Validate report target
  if (resourceId === undefined && collectionId === undefined) {
    throw new Error("Item to be reported must be specified")
  }

  // Create report
  const report = await db.report.create({
    data: { ...input, userId },
  })

  // Send message
  const baseUrl = process.env.BLITZ_DEV_SERVER_ORIGIN ?? process.env.HOST ?? "https://picsome.org"

  // TODO: Replace 'pathname' by 'href' as soon as it becomes available
  const url =
    resourceId !== undefined
      ? baseUrl +
        Routes.ResourcePage({ resourceId }).pathname.replace("[resourceId]", resourceId.toString())
      : baseUrl +
        Routes.CollectionPage({ collectionId: collectionId! }).pathname.replace(
          "[collectionId]",
          collectionId!.toString()
        )

  await ReportMailer.send({ url, reason, message })
  return report
})

export default createReport
