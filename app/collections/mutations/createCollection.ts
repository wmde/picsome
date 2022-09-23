import db, { CollectionType } from "db"
import { resolver } from "blitz"
import { z } from "zod"
import { WikidataItem, wikidataItemSchema } from "app/core/services/wikidata"

const createCollectionInputSchema = z.object({
  title: z.string(),
  type: z
    .enum([
      CollectionType.PrivateCollection,
      CollectionType.JointCollection,
      CollectionType.SmartCollection,
    ])
    .optional(),
  tags: z.array(wikidataItemSchema).optional(),
  locale: z.string().optional(),
})

export default resolver.pipe(
  resolver.zod(createCollectionInputSchema),
  resolver.authorize(),
  async (input, ctx) => {
    const { userId } = ctx.session

    // Create new collection with optional initial item
    const locale = input.locale
    let tags: WikidataItem[] = []

    if (input.type === CollectionType.SmartCollection) {
      tags = input.tags || []
      if (tags.length === 0) {
        throw new Error("At least one tag must be provided to create a smart collection")
      }
    }

    const collection = await db.collection.create({
      data: {
        title: input.title,
        type: input.type,
        tags: {
          connectOrCreate: tags.map((tag) => ({
            where: { wdId: tag.id },
            create: {
              wdId: tag.id,
              labels:
                locale !== undefined
                  ? {
                      connectOrCreate: {
                        where: {
                          wdId_locale: {
                            wdId: tag.id,
                            locale: locale,
                          },
                        },
                        create: {
                          locale: locale,
                          label: tag.label,
                          description: tag.description || "",
                        },
                      },
                    }
                  : undefined,
            },
          })),
        },
        user: { connect: { id: userId } },
      },
    })

    return collection
  }
)
