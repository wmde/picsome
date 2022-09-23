import db from "db"
import { confirmEmailInputSchema } from "../validations"
import { hash256, resolver } from "blitz"

export class ConfirmEmailError extends Error {
  name = "ConfirmEmailError"
  message = "Email confirmation link is invalid or it has expired."
}

export default resolver.pipe(
  resolver.zod(confirmEmailInputSchema),
  resolver.authorize(),
  async ({ token }, ctx) => {
    // 1. Try to find this token in the database
    const hashedToken = hash256(token)
    const possibleToken = await db.token.findFirst({
      where: { hashedToken, type: "CONFIRM_NEW_EMAIL" },
      include: { user: true },
    })

    // 2. If token not found, error
    if (!possibleToken) {
      throw new ConfirmEmailError()
    }
    const savedToken = possibleToken

    // 3. Delete token so it can't be used again
    await db.token.delete({ where: { id: savedToken.id } })

    // 4. If token has expired, error
    if (savedToken.expiresAt < new Date()) {
      throw new ConfirmEmailError()
    }

    // 5. Get new email
    let user = savedToken.user
    const newEmail = user.newUnconfirmedEmail
    if (!newEmail) {
      throw new ConfirmEmailError()
    }

    // 6. Since token is valid, now we can change the user's email
    user = await db.user.update({
      where: { id: savedToken.userId },
      data: {
        email: newEmail,
        newUnconfirmedEmail: null,
      },
    })

    return true
  }
)
