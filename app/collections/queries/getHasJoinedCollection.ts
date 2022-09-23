import { NotFoundError, resolver } from "blitz"
import { z } from "zod"
import db from "db"

const HasJoinedCollection = z.object({
  id: z.number(),
})

/**
 * Query wether the currently authorized user has joined the given collection.
 */
export default resolver.pipe(resolver.zod(HasJoinedCollection), async (input, ctx) => {
  const { id } = input
  const { userId } = ctx.session

  if (!userId) {
    return false
  }

  const collection = await db.collection.findUnique({
    where: { id },
    include: {
      collectors: {
        select: { id: true },
        where: { id: userId },
      },
    },
  })

  if (collection === null) {
    throw new NotFoundError()
  }

  return collection.collectors.findIndex((c) => c.id === userId) !== -1
})
