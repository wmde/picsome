import db from "db"
import logout from "./logout"
import { DeleteAccount } from "../validations"
import { NotFoundError, resolver } from "blitz"

const DEFAULT_USER_ID = 1

export default resolver.pipe(resolver.zod(DeleteAccount), resolver.authorize(), async ({}, ctx) => {
  // TODO: This is a dangerous action and might require reauthentication

  // 1. Get the user
  const user = await db.user.findFirst({ where: { id: ctx.session.userId! } })
  if (!user) {
    throw new NotFoundError()
  }

  // 2. Log out the user
  await logout({}, ctx)

  // 3. Revoke and delete all existing login sessions for this user
  await db.session.deleteMany({ where: { userId: user.id } })

  // 4. Delete all tokens for this user
  await db.token.deleteMany({ where: { userId: user.id } })

  // 5. Move the user's tags to the default user
  await db.tag.updateMany({
    where: { userId: user.id },
    data: {
      userId: DEFAULT_USER_ID,
    },
  })

  // 6. Delete all collections the user owns
  await db.collection.deleteMany({ where: { userId: user.id } })

  // 7. Delete the user itself
  // Via referential actions collection items the user added get removed and
  // the user gets set to null on reports they submitted
  await db.user.delete({ where: { id: user.id } })

  return true
})
