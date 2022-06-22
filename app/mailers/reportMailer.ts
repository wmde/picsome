import previewEmail from "preview-email"
import transporter, { renderMjmlTemplate } from "../integrations/mail/nodemailer"

type ReportMailerProps = {
  resourceId: number
  reason: string
  message?: string
}

export function ReportMailer() {
  return {
    async send(props: ReportMailerProps) {
      // const { resourceId, reason = "", message = "" } = props

      const html = renderMjmlTemplate({
        template: "report",
        data: { ...props },
      })

      const msg = {
        from: '"picsome REPORT" <picsome@wikimedia.de>',
        to: "picsome+report@wikimedia.de",
        subject: "🚨 picsome - REPORT",
        html: html,
      }

      if (process.env.NODE_ENV === "production") {
        console.log("trying to send")
        const res = await transporter.sendMail(msg)
        return res
      } else {
        // Preview email in the browser
        return await previewEmail(msg)
      }
    },
  }
}

export default ReportMailer()
