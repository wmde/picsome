import { tx } from "@transifex/native"
import { render as renderMjml } from "mjml-react"
import ConfirmEmailMail from "./templates/confirmEmail"
import LoginMail from "./templates/login"
import ReportMail from "./templates/report"
import SignupMail from "./templates/signup"
import UserBlockedMail from "./templates/userBlocked"

let nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  host: process.env.MAILER,
  port: 25,
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
})

transporter.verify().then(console.log).catch(console.error)

export default transporter

/**
 * RENDER EMAIL TEMPLATES
 */

export type MailTemplateRenderOptions = {
  template: string
  data: any
}

export async function renderMjmlTemplate(renderOptions: MailTemplateRenderOptions) {
  const { data, template } = renderOptions

  // Change locale before rendering template
  const locale = data.locale ?? undefined
  if (locale !== undefined) {
    await tx.setCurrentLocale(locale)
  }

  let content

  switch (template) {
    case "login":
      content = LoginMail(data)
      break
    case "report":
      content = ReportMail(data)
      break
    case "signup":
      content = SignupMail(data)
      break
    case "confirmEmail":
      content = ConfirmEmailMail(data)
      break
    case "userBlocked":
      content = UserBlockedMail(data)
      break
    default:
      throw new Error(
        `Unknown Mjml template '${template}'. Don't forget to add it to \`nodemailer.ts\`.`
      )
  }

  // if (template !== "report") {
  //   content = L(data)
  // } else {
  //   content = ReportMail(data)
  // }
  const { html, errors } = renderMjml(content, { minify: undefined })
  if (errors.length) {
    console.warn("mjml errors detected", errors)
  }
  return html
}
