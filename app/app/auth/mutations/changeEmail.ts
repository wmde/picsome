import db from "db"
import { ChangeEmail } from "../validations"
import { NotFoundError, generateToken, hash256, resolver, Routes } from "blitz"
import { confirmNewEmailMailer } from "mailers/confirmNewEmailMailer"

const CONFIRM_EMAIL_TOKEN_EXPIRATION_IN_HOURS = 4

export default resolver.pipe(
  resolver.zod(ChangeEmail),
  resolver.authorize(),
  async ({ newEmail }, ctx) => {
    // TODO: This is a dangerous action and might require reauthentication

    // 1. Get the user
    const user = await db.user.findFirst({ where: { id: ctx.session.userId! } })
    if (!user) {
      throw new NotFoundError()
    }

    // 2. Check if the new email differs from the current one
    if (user.email === newEmail) {
      throw new Error(`Email is already set to ${newEmail}.`)
    }

    // 3. Generate the confirm email token and expiration date
    const token = generateToken()
    const hashedToken = hash256(token)
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + CONFIRM_EMAIL_TOKEN_EXPIRATION_IN_HOURS)

    const origin = process.env.BLITZ_DEV_SERVER_ORIGIN || process.env.HOST
    const confirmUrl = `${origin}${Routes.ConfirmEmailPage().pathname}?token=${token}`

    // 4. Delete any existing confirm email tokens
    // This is important as the user might use the first new email they enter to
    // confirm the email address they entered last
    await db.token.deleteMany({
      where: { type: "CONFIRM_NEW_EMAIL", userId: user.id },
    })

    // 5. Store the new unconfirmed email in user entity (not touching email)
    await db.user.update({
      where: { id: user.id },
      data: { newUnconfirmedEmail: newEmail },
    })

    // 6. Save the new confirm email token in the database
    await db.token.create({
      data: {
        user: { connect: { id: user.id } },
        type: "CONFIRM_NEW_EMAIL",
        expiresAt,
        hashedToken,
        sentTo: newEmail,
      },
    })

    // 7. Send the confirmation email
    await confirmNewEmailMailer({
      to: newEmail,
      newEmail,
      url: confirmUrl,
      // TODO: Where to get the user's locale from?
      locale: undefined,
    }).send()

    return true
  }
)
