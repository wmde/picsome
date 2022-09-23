import { NotFoundError, resolver } from "blitz"
import db from "db"

type GetLicenseFeaturesInput = {
  licenseId: number
}

const getLicenseFeatures = resolver.pipe(async (input: GetLicenseFeaturesInput, ctx) => {
  const license = await db.license.findUnique({
    where: { id: input.licenseId },
    include: { group: { include: { features: true } } },
  })
  if (license === null) {
    throw new NotFoundError()
  }
  return license.group.features
})

export default getLicenseFeatures
