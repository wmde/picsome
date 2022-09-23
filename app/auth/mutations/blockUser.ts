import db from "db"
import deleteAccount from "./deleteAccount"
import { NotFoundError, resolver } from "blitz"
import { blockUserInputSchema } from "../validations"
import { userBlockedMailer } from "mailers/userBlockedMailer"

const blockUser = resolver.pipe(
  resolver.zod(blockUserInputSchema),
  resolver.authorize("ADMIN"),
  async (input, ctx) => {
    // 1. Get the user
    const user = await db.user.findUnique({ where: { email: input.email } })
    if (!user) {
      throw new NotFoundError(`User with email address ${input.email} could not be found`)
    }

    // 2. Rule out blocking the own account
    if (ctx.session.userId === user.id) {
      throw new Error("Blocking the own user account is not permitted")
    }

    // 3. Add the user to the block list
    void (await db.blockedUser.create({
      data: {
        originalUserId: user.id,
        email: user.email,
        blockMessage: input.blockMessage,
        blockedAt: new Date(),
      },
    }))

    // 4. Delete user account following the regular procedure
    await deleteAccount({ userId: user.id }, ctx)

    // 5. Notify user about being blocked via email
    const message = await userBlockedMailer({
      to: input.email,
      blockMessage: input.blockMessage,
    })
    await message.send()

    return true
  }
)

export default blockUser
