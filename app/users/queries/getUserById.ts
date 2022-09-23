import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetUser = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(GetUser),
  /*resolver.authorize(),*/ async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const user = await db.user.findFirst({
      where: { id: id },
      select: { id: true, name: true, email: true, role: true },
    })

    return user
  }
)
