import db, { CollectionType } from "db"
import getCollection from "../queries/getCollection"
import { resolver } from "blitz"
import { z } from "zod"
import { wikidataItemSchema } from "app/core/services/wikidata"

const updateCollectionInputSchema = z.object({
  id: z.number(),
  title: z.string().optional(),
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
  resolver.zod(updateCollectionInputSchema),
  resolver.authorize(),
  async ({ id, title, type, tags, locale }, ctx) => {
    const session = ctx.session

    // Get collection
    const collection = await getCollection({ id }, ctx)

    // Authorization
    if (collection.userId !== session.userId && !session.$isAuthorized(["ADMIN"])) {
      throw new Error("Only ADMIN users may edit collections created by other users")
    }

    // Compose update data
    const data: any = {}
    if (title !== undefined) {
      data.title = title
    }

    if (type !== undefined) {
      if (
        collection.type === CollectionType.SmartCollection &&
        type !== CollectionType.SmartCollection
      ) {
        throw new Error("Smart collections cannot be switched to another type")
      }
      if (
        collection.type !== CollectionType.SmartCollection &&
        type === CollectionType.SmartCollection
      ) {
        throw new Error("Collections cannot be switched to a smart collection")
      }
      data.type = type
    }

    if (tags !== undefined && tags.length > 0) {
      if (collection.type !== CollectionType.SmartCollection) {
        throw new Error("Tags must only be applied to smart collections")
      }
      data.tags = {
        set: [],
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
      }
    }

    // When switching to private collections, all collectors get removed
    if (data.type === "PrivateCollection") {
      data.collectors = { set: [] }
    }

    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    await db.collection.update({ where: { id }, data })

    return { id }
  },
  getCollection
)
