import { filterVisibleResourceWhereInput } from "app/reports/shared"
import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const getResourceInputSchema = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
  locale: z.string().optional(),
  filterVisible: z.boolean().optional(),
})

type GetResourceInput = z.infer<typeof getResourceInputSchema>

const getResource = async (input: GetResourceInput) => {
  const { id, locale = "en", filterVisible = true } = input
  const resource = await db.resource.findFirst({
    where: {
      id,
      AND: [filterVisible ? filterVisibleResourceWhereInput : {}],
    },
    include: {
      license: true,
      tags: {
        distinct: ["wdId"],
        include: { wikidataItem: { include: { labels: { where: { locale } } } } },
      },
    },
  })

  if (resource === null) {
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

export default resolver.pipe(resolver.zod(getResourceInputSchema), getResource)
