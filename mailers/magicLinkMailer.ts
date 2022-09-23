import previewEmail from "preview-email"
import transporter, { renderMjmlTemplate } from "../integrations/mail/nodemailer"
import { t } from "@transifex/native"

type MagicLinkMailer = {
  to: string
  url: string
  locale?: string
}

export function MagicLinkMailer() {
  const fromEMail = '"picsome BETA" <picsome@wikimedia.de>'

  return {
    async sendLogin({ to, url, locale }: MagicLinkMailer) {
      const loginSubject = t("🔮 Dein Login Link für picsome")

      const html = await renderMjmlTemplate({
        template: "login",
        data: { url, locale },
      })

      const msg = {
        from: fromEMail,
        to,
        subject: loginSubject,
        html: html,
      }

      if (process.env.NODE_ENV === "production") {
        const res = await transporter.sendMail(msg)
        return res
      } else {
        // Preview email in the browser
        return await previewEmail(msg)
      }
    },
    async sendSignup({ to, url, locale }: MagicLinkMailer) {
      const signupSubject = t("👋 Willkommen bei picsome!")

      const html = await renderMjmlTemplate({
        template: "signup",
        data: { url, locale },
      })

      const msg = {
        from: fromEMail,
        to,
        subject: signupSubject,
        html: html,
      }

      if (process.env.NODE_ENV === "production") {
        const res = await transporter.sendMail(msg)
        return res
      } else {
        // Preview email in the browser
        return await previewEmail(msg)
      }
    },
  }
}

export default MagicLinkMailer()
