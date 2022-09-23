import Loader from "app/core/components/Loader"
import styles from "./LoginForm.module.scss"
import { CheckCircle } from "app/core/components/Icons"
import { Form } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { MagicLoginInput } from "../validations"
import { useRouter } from "blitz"
import { useState } from "react"
import { useT, T, UT } from "@transifex/react"

export const LoginForm = (props: { onSuccess?: () => void }) => {
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async ({ email }) => {
    setLoading(true)

    const input: MagicLoginInput = {
      type: "login",
      destination: email,
      locale: router.locale ?? null,
    }

    const response = await fetch("/api/auth/magiclogin/send", {
      method: "POST",
      body: JSON.stringify(input),
      headers: { "Content-Type": "application/json" },
    })

    if (response.ok) {
      setSuccess(true)
      setLoading(false)
    }
  }

  const submitText = useT("Login anfordern")
  const emailLabel = useT("E-Mail")
  const emailPlaceholder = useT("E-Mail Adresse eingeben")

  return (
    <>
      <h1 className={styles.headline}>
        <T _str="Login" />
      </h1>
      {!loading && !success && (
        <>
          <span className={styles.label}>
            <T _str="Du willst zu deinen Sammlungen? Gib hier die E-Mail-Adresse ein, mit der du dich registriert hast, und wir schicken dir einen Login-Link zu." />
          </span>

          <Form
            submitText={submitText}
            initialValues={{ email: "" }}
            onSubmit={handleLogin}
            className={styles.form}
          >
            <LabeledTextField
              label={emailLabel}
              name="email"
              placeholder={emailPlaceholder}
              required
            />
          </Form>
        </>
      )}
      {!success && loading && <Loader />}
      {success && !loading && (
        <div className={styles.success}>
          <CheckCircle />
          <UT _str="Willkommen zurück! Wir haben Dir per E-Mail einen Login-Link zugeschickt, der dich direkt zu deinen Sammlungen bringt.<br /><strong>Bitte überprüfe dein Postfach!</strong>" />
        </div>
      )}
    </>
  )
}

export default LoginForm
