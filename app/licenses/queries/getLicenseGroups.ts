import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(async () => {
  return await db.licenseGroup.findMany({ include: { features: true } })
})
