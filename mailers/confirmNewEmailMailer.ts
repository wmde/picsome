import { t } from "@transifex/native"
import transporter, { renderMjmlTemplate } from "integrations/mail/nodemailer"
import previewEmail from "preview-email"

const fromEmail = '"picsome BETA" <picsome@wikimedia.de>'

export async function confirmNewEmailMailer({
  to,
  newEmail,
  url,
  locale,
}: {
  to: string
  newEmail: string
  url: string
  locale?: string
}) {
  const loginSubject = t("Bestätige deine neue E-Mail Adresse")

  const html = await renderMjmlTemplate({
    template: "confirmEmail",
    data: { newEmail, url, locale },
  })

  const msg = {
    from: fromEmail,
    to,
    subject: loginSubject,
    html: html,
  }

  return {
    async send() {
      if (process.env.NODE_ENV === "production") {
        const res = await transporter.sendMail(msg)
        return res
      } else {
        // Preview email in the browser
        await previewEmail(msg)
      }
    },
  }
}
