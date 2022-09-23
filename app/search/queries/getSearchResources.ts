import { Prisma } from "@prisma/client"
import { resolver } from "blitz"
import { PaginatedItems, resourceFilersSchema } from "../types"
import { searchOpenverse } from "integrations/ccsearch/search"
import { z } from "zod"
import getResources, { LicensedAndTaggedResource } from "app/resources/queries/getResources"

const getSearchResourcesInputSchema = z.object({
  wikidataIds: z.array(z.string()),
  filters: resourceFilersSchema,
  take: z.number().min(1).max(100).optional(),
  skip: z.number().min(0).optional(),
})

/** Map license group ids to points that resources are ordered by in ASC order */
const licenseGroupIdOrderMap: { [id: string]: number } = {
  PD: 0,
  CC0: 1,
  CCBY: 2,
  CCBYSA: 3,
  CCBYNC: 4,
  CCBYNCSA: 5,
  CCBYND: 6,
  CCBYNCND: 7,
}

const getSearchResources = resolver.pipe(
  resolver.zod(getSearchResourcesInputSchema),
  async (input, ctx): Promise<PaginatedItems<LicensedAndTaggedResource>> => {
    const { wikidataIds, filters, take = 30, skip = 0 } = input

    // Validate wikidataIds
    if (wikidataIds.length === 0) {
      throw new Error("Void search is not allowed")
    }

    // Apply resource detail filters
    const resourceDetailsWhereInput: Prisma.ResourceDetailsWhereInput = {}
    if (filters.sizes !== undefined && filters.sizes.length > 0) {
      resourceDetailsWhereInput.size = { in: filters.sizes }
    }
    if (filters.aspects !== undefined && filters.aspects.length > 0) {
      resourceDetailsWhereInput.aspect = { in: filters.aspects }
    }
    if (filters.fileFormats !== undefined && filters.fileFormats.length > 0) {
      resourceDetailsWhereInput.fileformat = { in: filters.fileFormats }
    }

    // Apply license filters
    const licenseGroupWhereInput: Prisma.LicenseGroupWhereInput = {}
    if (filters.licenseFeatures !== undefined && filters.licenseFeatures.length > 0) {
      licenseGroupWhereInput.features = { some: { id: { in: filters.licenseFeatures } } }
    }
    if (filters.licenseGroups !== undefined && filters.licenseGroups.length > 0) {
      licenseGroupWhereInput.id = { in: filters.licenseGroups }
    }

    // Fetch resources
    const paginatedResources = await getResources(
      {
        where: {
          details: resourceDetailsWhereInput,
          license: { group: licenseGroupWhereInput },
        },
        filterWikidataIds: wikidataIds,
        filterVisible: true,
        orderBy: { id: "asc" },
        take: take,
        skip: skip,
      },
      ctx
    )

    const remainingResources = take - paginatedResources.items.length
    const appendOpenverseResources = filters.curated !== true

    // TODO: Prevent duplicates (curated resources returned by Openverse)

    if (appendOpenverseResources) {
      if (remainingResources === 0) {
        // Alter paginated resources object to signal results from Openverse
        paginatedResources.hasMore = true
        paginatedResources.count += 1
      } else {
        // Fetch resources from Openverse
        const takeOpenverseResources = remainingResources
        const skipOpenverseResources = skip === 0 ? 0 : skip - paginatedResources.count

        const paginatedOpenverseResources = await searchOpenverse(
          input.wikidataIds,
          filters,
          takeOpenverseResources,
          skipOpenverseResources
        )

        // Merge paginated resources
        paginatedResources.items = paginatedResources.items.concat(
          paginatedOpenverseResources.items
        )
        paginatedResources.hasMore = paginatedOpenverseResources.hasMore
        paginatedResources.count += paginatedOpenverseResources.count
      }

      if (paginatedResources.hasMore) {
        paginatedResources.nextPage = { take: take, skip: skip + take }
      }
    }

    // Sort resources by 1. wether they are curated and 2. their license group
    paginatedResources.items.sort((a, b) => {
      const aGroup = licenseGroupIdOrderMap[a.license.groupId] ?? 7
      const aCurated = a.tags.length > 0 ? 0 : 100
      const bGroup = licenseGroupIdOrderMap[b.license.groupId] ?? 7
      const bCurated = b.tags.length > 0 ? 0 : 100
      return aGroup + aCurated - (bGroup + bCurated)
    })

    return paginatedResources
  }
)

export default getSearchResources
export type GetSearchResourcesInput = z.infer<typeof getSearchResourcesInputSchema>
