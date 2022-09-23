import { z } from "zod"
import {
  LicenseFeatureValue,
  LicenseGroupValue,
  ResourceAspect,
  ResourceFileformat,
  ResourceSize,
} from "@prisma/client"

const searchItemTypeSchema = z.union([
  z.literal("Resource"),
  z.literal("OpenverseResource"),
  z.literal("Collection"),
])
export type SearchItemType = z.infer<typeof searchItemTypeSchema>

export const resourceSizeSchema: z.ZodType<ResourceSize> = z.union([
  z.literal("Big"),
  z.literal("Medium"),
  z.literal("Small"),
])

export const resourceAspectSchema: z.ZodType<ResourceAspect> = z.union([
  z.literal("Portrait"),
  z.literal("Landscape"),
  z.literal("Square"),
])

export const resourceFileFormatSchema: z.ZodType<ResourceFileformat> = z.union([
  z.literal("JPG"),
  z.literal("PNG"),
  z.literal("GIF"),
  z.literal("SVG"),
  z.literal("Other"),
])

export const licenseFeatureSchema: z.ZodType<LicenseFeatureValue> = z.union([
  z.literal("Commercial"),
  z.literal("Modify"),
  z.literal("Distribute"),
  z.literal("NameAuthor"),
  z.literal("ShareAlike"),
])

export const licenseGroupSchema: z.ZodType<LicenseGroupValue> = z.union([
  z.literal("CC0"),
  z.literal("PD"),
  z.literal("CCBY"),
  z.literal("CCBYSA"),
  z.literal("CCBYNC"),
  z.literal("CCBYND"),
  z.literal("CCBYNCSA"),
  z.literal("CCBYNCND"),
])

export const resourceFilersSchema = z.object({
  curated: z.boolean().optional(),
  sizes: z.array(resourceSizeSchema).optional(),
  aspects: z.array(resourceAspectSchema).optional(),
  fileFormats: z.array(resourceFileFormatSchema).optional(),
  licenseFeatures: z.array(licenseFeatureSchema).optional(),
  licenseGroups: z.array(licenseGroupSchema).optional(),
})

export type ResourceFilers = z.infer<typeof resourceFilersSchema>

export interface PaginatedItems<ItemType> {
  items: ItemType[]
  nextPage: {
    take: number
    skip: number
  } | null
  hasMore: boolean
  count: number
}
