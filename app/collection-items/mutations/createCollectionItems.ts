import db from "db"
import getResources from "app/resources/queries/getResources"
import { resolver } from "blitz"
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

    const paginatedResources = await getResources(
      {
        where: { id: { in: resourceIds } },
        take: resourceIds.length,
      },
      ctx
    )

    await db.collectionItem.createMany({
      data: paginatedResources.items.map((resource) => ({
        resourceId: resource.id,
        collectionId,
        userId,
      })),
    })
  }
)
