import MagicLoginStrategy from "passport-magic-login"
import MagicLinkMailer from "mailers/magicLinkMailer"
import db from "db"
import { z } from "zod"
import fetch from "node-fetch"

const Payload = z.object({
  name: z.string().optional(),
  destination: z.string(),
  terms: z.boolean().optional(),
})

if (typeof process.env.MAGIC_LINK_SECRET !== "string" || !process.env.MAGIC_LINK_SECRET) {
  throw new Error('Please provide "MAGIC_LINK_SECRET" env var.')
}

const magicLogin = new MagicLoginStrategy({
  callbackUrl:
    (process.env.BLITZ_DEV_SERVER_ORIGIN || process.env.HOST) + "/api/auth/magiclogin/callback",
  confirmUrl:
    (process.env.BLITZ_DEV_SERVER_ORIGIN || process.env.HOST) + "/api/auth/magiclogin/confirm",
  secret: process.env.MAGIC_LINK_SECRET,

  async sendMagicLink(to, url, code, req) {
    const payload = req.method === "GET" ? req.query : req.body
    const locale = req.body.locale
    const newsletter = req.body.newsletter

    if (payload.terms) {
      // SEND SIGNUP
      console.log("##### SIGNUP")

      // Do the work in parallel
      const newsletterPromise = newsletter ? subscribeToNewsletter(to, locale) : undefined
      await MagicLinkMailer.sendSignup({ to, url, locale })
      newsletterPromise && (await newsletterPromise)
    } else {
      // SEND LOGIN
      console.log("##### LOGIN")
      let user = await db.user.findFirst({ where: { email: to } })
      if (user) {
        await MagicLinkMailer.sendLogin({ to, url, locale })
      } else {
        throw new Error("user doesnt exist, needs to sign up first")
      }
    }
  },

  async verify(payload, verifyCallback) {
    console.log(payload)
    if (!payload) return

    const { name, destination: email, terms } = Payload.parse(payload)
    let user = await db.user.findFirst({ where: { email } })
    if (!user && !terms) throw Error("user needs to be signed up first")
    if (!user) {
      if (terms) {
        user = await db.user.create({
          data: { email, name, termsSignedAt: new Date() },
        })
      } else {
        throw Error("didnt accept terms of service")
      }
    }

    const publicData = {
      userId: user.id,
      roles: [user.role],
      source: "magiclogin",
    }

    verifyCallback(undefined, { publicData })
  },
})

const subscribeToNewsletter = async (email: string, locale: string) => {
  console.log(`Subscribing ${email} (${locale}) to the newsletter.`)

  const recipientListId = process.env.RAPIDMAIL_RECIPIENT_LIST_ID
  const username = process.env.RAPIDMAIL_API_USERNAME
  const password = process.env.RAPIDMAIL_API_PASSWORD

  if (!recipientListId || !username || !password) {
    console.error(
      `Error while subscribing ${email} to the newsletter. ` +
        "Please make sure all required rapidmail env variables are present."
    )
    return false
  }

  const authToken = Buffer.from(`${username}:${password}`).toString("base64")
  const response = await fetch("https://apiv3.emailsys.net/recipients?send_activationmail=yes", {
    method: "POST",
    body: JSON.stringify({
      recipientlist_id: recipientListId,
      email,
      extra1: locale,
      // extra2: 'Picsome',
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + authToken,
    },
  })

  if (response.status !== 201) {
    console.error(
      `Error while subscribing ${email} to the newsletter. ` +
        `Received status code ${response.status}.`
    )
    return false
  }

  return true
}

export default magicLogin
