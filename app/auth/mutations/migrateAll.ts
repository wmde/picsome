import db, { CollectionType } from "db"
import logout from "./logout"
import { AuthenticationError, NotFoundError, resolver } from "blitz"
import { deleteAccountInputSchema } from "../validations"

const DEFAULT_USER_ID = 1

const migrateAll = resolver.pipe(resolver.authorize(), async (input, ctx) => {
  // 1. Authorize deletion action
  // TODO: This is a dangerous action and might require reauthentication
  // A user may delete itself or may be deleted by an admin user
  // if (ctx.session.userId !== input.userId && !ctx.session.$isAuthorized("ADMIN")) {
  //   throw new AuthenticationError("Only admin users may delete other users")
  // }

  // 2. Get all users
  const users = await db.user.findMany({ where: { role: "USER" } })

  if (!users) {
    throw new NotFoundError()
  }

  await users.map(async (user) => {
    // 4. Revoke and delete all existing login sessions for this user
    await db.session.deleteMany({ where: { userId: user.id } })

    // 5. Delete all tokens for this user
    await db.token.deleteMany({ where: { userId: user.id } })

    // 6. Move the user's tags to the default user
    await db.tag.updateMany({
      where: { userId: user.id },
      data: { userId: DEFAULT_USER_ID },
    })

    // 7. Move ownership of joint collections to the default user
    await db.collection.updateMany({
      where: { userId: user.id },
      data: { userId: DEFAULT_USER_ID },
    })

    // 9. Delete the user itself
    // Via referential actions collection items the user added get removed and
    // the user gets set to null on reports they submitted
    await db.user.delete({ where: { id: user.id } })
  })

  return true
})

export default migrateAll
