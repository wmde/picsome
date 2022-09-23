import MagicLinkMailer from "mailers/magicLinkMailer"
import MagicLoginStrategy from "passport-magic-login"
import db, { User } from "db"
import logger from "integrations/license-check/libs/logger"
import subscribeToMailingList from "app/users/mutations/subscribeToMailingList"
import { AuthenticationError } from "blitz"
import { magicLoginInputSchema } from "../validations"

const baseUrl = process.env.BLITZ_DEV_SERVER_ORIGIN ?? process.env.HOST
const magicLinkSecret = process.env.MAGIC_LINK_SECRET
if (magicLinkSecret === undefined || magicLinkSecret === "") {
  throw new Error('Please provide "MAGIC_LINK_SECRET" env var.')
}

const magicLoginStrategy = new MagicLoginStrategy({
  callbackUrl: `${baseUrl}/api/auth/magiclogin/callback`,
  confirmUrl: `${baseUrl}/api/auth/magiclogin/confirm`,
  secret: magicLinkSecret,
  async sendMagicLink(destination, href, verificationCode, req) {
    // Parse and validate input
    const input = magicLoginInputSchema.parse(req.body)
    const email = destination
    const { type, locale } = input

    // Make sure email is not on the block list (for both login and signup)
    const blockedUser = await db.blockedUser.findUnique({
      where: { email },
      select: { id: true },
    })

    if (blockedUser !== null) {
      logger.info(`Blocked ${type} attempt by ${email}`)
      throw new AuthenticationError("This email address is blocked")
    }

    // Try to find a user with this email address
    const existingUser = await db.user.findUnique({ where: { email: email } })

    // Differentiate between signup and login
    if (type === "signup") {
      logger.info(`Signup attempt by ${email} using the MagicLoginStrategy`)

      // Check if user already exists
      if (existingUser !== null) {
        logger.info(`User with email address ${email} already exists`)
        throw new Error("User already exists, please login instead")
      }

      // Check if the terms have been accepted
      if (!input.acceptTerms) {
        logger.info(`User with email ${email} did not accept the terms`)
        throw new AuthenticationError("The user must accept the terms")
      }

      // Do work in parallel
      await Promise.all([
        // Send magic login link for signup
        MagicLinkMailer.sendSignup({
          to: email,
          url: href,
          locale: locale ?? undefined,
        }),
        // Optionally subscribe to the mailing list
        input.subscribe ? subscribeToMailingList({ email, locale }) : undefined,
      ])
    } else {
      logger.info(`Login attempt by ${email} using the MagicLoginStrategy`)

      // Match existing user by email
      // TODO: Send an email in both cases to not give away a user's existence
      if (existingUser === null) {
        logger.info(`User with email address ${email} does not exist`)
        throw new Error("User doesn't exist and needs to sign up first")
      }

      // Send magic login link
      await MagicLinkMailer.sendLogin({
        to: email,
        url: href,
        locale: locale ?? undefined,
      })
    }
  },
  async verify(payload, verifyCallback) {
    // Parse and validate input
    const input = magicLoginInputSchema.parse(payload)
    const { type, destination } = input
    const email = destination

    // Find existing user by email
    let user: User | null = await db.user.findUnique({ where: { email: email } })

    // Handle signup case
    if (type === "signup") {
      if (user !== null) {
        throw new Error("User already exists, please login instead")
      }
      user = await db.user.create({
        data: {
          email,
          termsSignedAt: new Date(),
        },
      })
    }

    if (user === null) {
      throw new Error("User doesn't exist and needs to sign up first")
    }

    // Populate session public data
    logger.info(`Successful ${type} by ${email} as user id ${user.id} using the MagicLoginStrategy`)
    const publicData = {
      userId: user.id,
      roles: [user.role],
      source: "magiclogin",
    }
    verifyCallback(undefined, { publicData })
  },
})

export default magicLoginStrategy
