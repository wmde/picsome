import { resolver, NotFoundError } from "blitz"
import db, { Prisma } from "db"

export default resolver.pipe(async () => {
  return await db.licenseGroup.findMany({ include: { features: true } })
})
