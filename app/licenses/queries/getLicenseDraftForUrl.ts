import { LicenseGroupValue, Prisma } from "@prisma/client"
import { getKnownLicenses, licenseGroupFeatures } from "../shared"
import { z } from "zod"
import logger from "integrations/license-check/libs/logger"

type GetLicenseDraftForUrlInput = {
  url: string
}

const getLicenseDraftForUrl = async (
  input: GetLicenseDraftForUrlInput
): Promise<Prisma.LicenseCreateInput | undefined> => {
  let licenseUrl = input.url

  // Normalize scheme to HTTPS
  licenseUrl = licenseUrl.replace(/^https?:\/\//i, "https://")

  // Parse url
  let parsedLicenseUrl: URL | undefined
  try {
    parsedLicenseUrl = new URL(licenseUrl)
  } catch (error) {
    // Reject if url cannot be parsed
    logger.error(`getLicenseDraftForUrl: Received invalid license URL '${licenseUrl}'`)
    return undefined
  }

  // Try to match license url to a known license
  const knownLicenses = await getKnownLicenses()
  const lowercaseLicenseUrl = licenseUrl.toLowerCase()
  const knownLicense = knownLicenses.find(
    (knownLicense) => knownLicense.url.toLowerCase() === lowercaseLicenseUrl
  )

  // Gather license details
  let canonicalUrl: string | undefined
  let title: string | undefined
  let licenseGroup: LicenseGroupValue | undefined
  let version = ""
  let variant = ""
  let spdx = ""

  if (knownLicense !== undefined) {
    // Use known license details
    canonicalUrl = knownLicense.url
    title = knownLicense.title
    licenseGroup = knownLicense.group
    version = knownLicense.version ?? ""
    variant = knownLicense.variant ?? ""
    spdx = knownLicense.spdx ?? ""
  } else if (parsedLicenseUrl.hostname.toLowerCase() === "creativecommons.org") {
    // Parse license details from Creative Commons URL parts
    const pathnameParts = parsedLicenseUrl.pathname.split("/").filter((s) => s !== "")
    const rawLicenseGroup = "CC" + pathnameParts[1]?.replaceAll("-", "").toUpperCase()
    const licenseGroupResult = z.nativeEnum(LicenseGroupValue).safeParse(rawLicenseGroup)
    if (licenseGroupResult.success) {
      // Reject if encountering unknown license group
      canonicalUrl = licenseUrl
      licenseGroup = licenseGroupResult.data
      version = pathnameParts[2]?.toUpperCase() ?? ""
      variant = pathnameParts[3]?.toUpperCase() ?? ""
      title = `CC ${licenseGroup} ${version}${variant !== "" ? " " + variant : ""}`
      spdx = `${licenseGroup}-${version}${variant !== "" ? "-" + variant : ""}`
    }
  } else if (parsedLicenseUrl.hostname.toLowerCase() === "www.flickr.com") {
    // Use Flickr Commons license
    canonicalUrl = licenseUrl
    title = "Flickr Commons (CC0)"
    licenseGroup = LicenseGroupValue.CC0
    version = "1.0"
    variant = "Flickr"
    spdx = "CC0-1.0"
  }

  if (title === undefined || canonicalUrl === undefined || licenseGroup === undefined) {
    // Reject if crucial details are missing
    logger.error(`getLicenseDraftForUrl: Could not find license details for URL '${licenseUrl}'`)
    return undefined
  }

  // Compose create input
  return {
    title,
    version,
    variant,
    spdxCode: spdx,
    canonicalUrl,
    wdId: "",
    group: {
      connectOrCreate: {
        where: { id: licenseGroup },
        create: createLicenseGroupCreateInput(licenseGroup),
      },
    },
  }
}

const createLicenseGroupCreateInput = (
  licenseGroup: LicenseGroupValue
): Prisma.LicenseGroupCreateInput => {
  const licenseFeatures = licenseGroupFeatures[licenseGroup] ?? []
  if (licenseFeatures.length === 0) {
    throw new Error(`The license group '${licenseGroup}' has no known features`)
  }
  return {
    id: licenseGroup,
    features: {
      connectOrCreate: licenseFeatures.map((licenseFeature) => ({
        where: { id: licenseFeature },
        create: { id: licenseFeature },
      })),
    },
  }
}

export default getLicenseDraftForUrl
