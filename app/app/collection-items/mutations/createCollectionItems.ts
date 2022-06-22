import getResources from "app/resources/queries/getResources"
import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const createCollectionItemsSchema = z.object({
  resourceIds: z.array(z.number()),
  collectionId: z.number(),
})

export default resolver.pipe(
  resolver.zod(createCollectionItemsSchema),
  resolver.authorize(),
  async (input, ctx) => {
    const { userId } = ctx.session
    const { resourceIds, collectionId } = input

    const resources = await getResources({ where: { id: { in: resourceIds } } }, ctx)

    await db.collectionItem.createMany({
      data: resources.map((resource) => ({
        resourceId: resource.id,
        collectionId,
        userId,
      })),
    })
  }
)
