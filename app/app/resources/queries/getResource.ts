import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetResource = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
  locale: z.string().optional(),
  excludeReported: z.boolean().optional(),
  includeOpenReports: z.boolean().optional(),
})

const getResource = async ({
  id,
  locale = "en",
  excludeReported = true,
  includeOpenReports = false,
}) => {
  const resource = await db.resource.findFirst({
    where: {
      id,
      reports: excludeReported
        ? { none: { status: { in: ["Reported", "Pending", "Removed"] } } }
        : undefined,
    },
    include: {
      license: { include: { group: { include: { features: true } } } },
      reports: includeOpenReports
        ? { where: { status: { in: ["Reported", "Pending", "Removed"] } } }
        : undefined,
      tags: {
        distinct: ["wdId"],
        include: { wikidataItem: { include: { labels: { where: { locale } } } } },
      },
    },
  })

  if (!resource) {
    throw new NotFoundError()
  }

  // // REFS PCS-326
  // if (resource.thumbUrl.indexOf("api.creativecommons.engineering") > 0) {
  //   resource.thumbUrl = resource.thumbUrl.replaceAll(
  //     "api.creativecommons.engineering",
  //     "api.openverse.engineering"
  //   )
  // }

  return resource
}

export default resolver.pipe(resolver.zod(GetResource), getResource)
