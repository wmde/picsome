import { render as renderMjml } from "mjml-react"
import path from "path"
import ConfirmEmailMail from "./templates/confirmEmail"
import LoginMail from "./templates/login"
import ReportMail from "./templates/report"
import SignupMail from "./templates/signup"

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

export function renderMjmlTemplate(renderOptions: MailTemplateRenderOptions) {
  const { data, template } = renderOptions
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
