import { t } from "@transifex/native"
import transporter, { renderMjmlTemplate } from "integrations/mail/nodemailer"
import previewEmail from "preview-email"

const fromEmail = '"picsome BETA" <picsome@wikimedia.de>'

export async function userBlockedMailer({
  to,
  blockMessage,
  locale,
}: {
  to: string
  blockMessage: string
  locale?: string
}) {
  const loginSubject = t("Dein Konto wurde gesperrt")

  const html = await renderMjmlTemplate({
    template: "userBlocked",
    data: { blockMessage, locale },
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
