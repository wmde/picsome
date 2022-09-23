import logger from "integrations/license-check/libs/logger"
import { LicenseFeatureValue, LicenseGroupValue } from "@prisma/client"
import { readAndCacheLocalJsonFile } from "lib/json-cache"
import { z } from "zod"

const knownLicenseSchema = z.object({
  url: z.string(),
  title: z.string(),
  version: z.string().optional(),
  variant: z.string().optional(),
  spdx: z.string().optional(),
  group: z.nativeEnum(LicenseGroupValue),
})

/**
 * Load and cache the known licenses JSON file
 */
export const getKnownLicenses = async () => {
  const knownLicenses =
    (await readAndCacheLocalJsonFile("data/known-licenses.json", z.array(knownLicenseSchema))) ?? []
  if (knownLicenses.length === 0) {
    logger.error(`Known licenses could not be read`)
  }
  return knownLicenses
}

/**
 * Object mapping license group ids to feature values
 */
export const licenseGroupFeatures: { [name: string]: LicenseFeatureValue[] } = {
  PD: [LicenseFeatureValue.Modify, LicenseFeatureValue.Distribute, LicenseFeatureValue.Commercial],
  CC0: [LicenseFeatureValue.Commercial, LicenseFeatureValue.Modify, LicenseFeatureValue.Distribute],
  CCBY: [
    LicenseFeatureValue.Commercial,
    LicenseFeatureValue.Modify,
    LicenseFeatureValue.Distribute,
    LicenseFeatureValue.NameAuthor,
  ],
  CCBYNC: [
    LicenseFeatureValue.Modify,
    LicenseFeatureValue.Distribute,
    LicenseFeatureValue.NameAuthor,
  ],
  CCBYNCND: [LicenseFeatureValue.Distribute, LicenseFeatureValue.NameAuthor],
  CCBYNCSA: [
    LicenseFeatureValue.Distribute,
    LicenseFeatureValue.NameAuthor,
    LicenseFeatureValue.Modify,
    LicenseFeatureValue.ShareAlike,
  ],
  CCBYND: [
    LicenseFeatureValue.Distribute,
    LicenseFeatureValue.NameAuthor,
    LicenseFeatureValue.Commercial,
  ],
  CCBYSA: [
    LicenseFeatureValue.Modify,
    LicenseFeatureValue.Distribute,
    LicenseFeatureValue.Commercial,
    LicenseFeatureValue.ShareAlike,
    LicenseFeatureValue.NameAuthor,
  ],
}
