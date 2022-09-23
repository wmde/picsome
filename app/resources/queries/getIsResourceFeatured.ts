import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const getIsResourceFeaturedInputSchema = z.object({
  id: z.number(),
})

type GetIsResourceFeaturedInput = z.infer<typeof getIsResourceFeaturedInputSchema>

/** Id of the 'Featured Images' collection */
const featuredCollectionId = 1

/**
 * Return true if the given resource id is featured.
 * Resources that are an item of the 'Featured Images' collection are considered
 * to be featured.
 */
const getIsResourceFeatured = async ({ id }: GetIsResourceFeaturedInput) => {
  const item = await db.collectionItem.findFirst({
    select: { id: true },
    where: {
      resourceId: id,
      collectionId: featuredCollectionId,
    },
  })
  return item !== null
}

export default resolver.pipe(resolver.zod(getIsResourceFeaturedInputSchema), getIsResourceFeatured)
