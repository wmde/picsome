import { resolver } from "blitz"
import db, { Prisma } from "db"
import { z } from "zod"
import { getMyTagsQuery } from "../queries/getMyTags"
import getTags from "../queries/getTags"

const config = require("blitz.config")

async function fetchWikidataLabels(wdId: string) {
  const locales = new Set(config.i18n.locales)
  const res = await fetch(`https://commons.wikimedia.org/wiki/Special:EntityData/${wdId}.json`)
  if (res.ok) {
    const body = await res.json()
    const { entities } = body
    const entity = entities[wdId]
    const { labels, descriptions } = entity
    return Object.keys(labels)
      .filter((locale) => locales.has(locale))
      .map((locale) => {
        const lab = labels[locale]
        const desc = descriptions[locale]
        let description = ""
        const label = lab.value as string
        if (desc !== undefined) {
          description = desc.value
        }
        return { wdId, locale, label, description }
      })
  }
  return []
}
async function fetchAndCrateWikidataLabels(wdId: string) {
  const data = await fetchWikidataLabels(wdId)
  for (let l of data) {
    try {
      await db.wikidataItemLabel.create({ data: l })
    } catch (e) {
      // one of these will already exist
    }
  }
}
const CreateTag = z.object({
  resourceId: z.number(),
  wdId: z.string(),
  label: z.string(),
  description: z.string(),
  locale: z.string().optional(),
})

export default resolver.pipe(
  resolver.zod(CreateTag),
  resolver.authorize(),
  async (input, ctx, locale = "en") => {
    const { userId } = ctx.session
    const { wdId, label, description, resourceId } = input
    const data: Prisma.TagCreateInput = {
      resource: { connect: { id: resourceId } },
      wdId,
      label,
      description,
      user: { connect: { id: userId } },
      wikidataItem: {
        connectOrCreate: {
          where: { wdId },
          create: {
            wdId,
            labels: {
              connectOrCreate: {
                where: { wdId_locale: { wdId, locale } },
                create: { locale, label, description },
              },
            },
          },
        },
      },
    }

    const res = await db.tag.create({ data, include: { wikidataItem: true } })
    if (res.createdAt.getTime() === res.wikidataItem.createdAt.getTime()) {
      fetchAndCrateWikidataLabels(wdId) // We do not await because we dont care how long this takes
    }
    return await getTags({ resourceId: input.resourceId }, ctx)
  }
)
