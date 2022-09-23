import { resolver } from "blitz"
import getResource from "./getResource"
import getResources, { GetResourcesInput } from "./getResources"

type GetResourcesRelatedInput = {
  resourceId: number
  filterVisible?: boolean
}

const getResourcesRelated = resolver.pipe(async (input: GetResourcesRelatedInput, ctx) => {
  const resource = await getResource(
    {
      id: input.resourceId,
      filterVisible: false,
    },
    ctx
  )

  const wikidataIds = resource.tags.map((tag) => tag.wdId)

  return {
    where: {
      id: { not: input.resourceId },
      tags: { some: { wdId: { in: wikidataIds } } },
    },
    filterVisible: input.filterVisible,
  } as GetResourcesInput
}, getResources)

export default getResourcesRelated
