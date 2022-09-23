import getResources, { GetResourcesInput } from "./getResources"
import { Prisma } from "db"
import { resolver } from "blitz"

interface GetResourcesTaggedByUserInput extends Pick<Prisma.ResourceFindManyArgs, "skip" | "take"> {
  filterVisible?: boolean
}

const getResourcesTaggedByUser = resolver.pipe(
  resolver.authorize(),
  async (input: GetResourcesTaggedByUserInput, ctx) => {
    const { skip = 0, take = 100, filterVisible = true } = input
    return {
      where: { tags: { some: { userId: ctx.session.userId } } },
      filterVisible,
      skip,
      take,
    } as GetResourcesInput
  },
  getResources
)

export default getResourcesTaggedByUser
