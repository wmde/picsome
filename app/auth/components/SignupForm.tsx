import FormCheckBox from "app/core/components/FormCheckBox"
import Loader from "app/core/components/Loader"
import styles from "./LoginForm.module.scss"
import { CheckCircle } from "app/core/components/Icons"
import { Form } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Routes, useRouter } from "blitz"
import { useState } from "react"
import { useT, T, UT } from "@transifex/react"
import { MagicLoginInput } from "../validations"

export const SignupForm = (props: { onSuccess?: () => void }) => {
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (payload) => {
    setLoading(true)

    const input: MagicLoginInput = {
      type: "signup",
      destination: payload.email,
      acceptTerms: payload.acceptTerms ?? false,
      subscribe: payload.subscribe ?? false,
      locale: router.locale ?? null,
    }

    console.log("input", input)

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

  const submitText = useT("Registrierung abschließen")
  const emailLabel = useT("E-Mail")
  const emailPlaceholder = useT("E-Mail-Adresse eingeben")

  const termsLinkUrl = Routes.NutzungsbedingungenPage().pathname
  const privacyPolicyUrl = Routes.PrivacyPolicy().pathname

  return (
    <>
      <h1 className={styles.headline}>
        <T _str="Registrierung" />
      </h1>
      {!loading && !success && (
        <span className={styles.label}>
          <T _str="Jetzt kostenlos bei picsome registrieren und eigene Sammlungen anlegen: Alles, was du dafür benötigst, ist deine E-Mail-Adresse." />
        </span>
      )}
      {!loading && !success && (
        <Form
          submitText={submitText}
          initialValues={{
            email: "",
          }}
          onSubmit={handleLogin}
          className={styles.form}
        >
          <LabeledTextField
            label={emailLabel}
            name="email"
            placeholder={emailPlaceholder}
            required
          />
          <span className={styles.label__small}>
            <T _str="Du musst für die Registrierung kein Passwort erstellen. Der nächste Login erfolgt über einen „Magic Link“. Das heißt, wenn du dich das nächste Mal einloggen möchtest, senden wir dir einen Login-Link an die hier von dir angegebene E-Mail-Adresse." />
          </span>
          <FormCheckBox name="acceptTerms" required>
            <T
              _str="Hiermit bestätige ich dass ich die {terms} und {privacyPolicy} gelesen und verstanden habe und stimme zu."
              terms={
                <a href={termsLinkUrl} target="_blank" rel="noreferrer">
                  <T _str="AGBs" />
                </a>
              }
              privacyPolicy={
                <a href={privacyPolicyUrl} target="_blank" rel="noreferrer">
                  <T _str="Datenschutzbedingungen" />
                </a>
              }
            />
          </FormCheckBox>
          <FormCheckBox name="subscribe">
            <T
              _str="Wikimedia Newsletter abonnieren: Indem ich dieses Häkchen setze, erkläre ich meine Einwilligung (Art. 6 Abs. 1 lit. a) DSGVO) von Wikimedia per E-Mail bis auf Widerruf über Aktuelles informiert zu werden, wofür Wikimedia die hierzu erforderlichen Datenverarbeitungen vornimmt. Ich kann meine Einwilligung jederzeit mit Wirkung für die Zukunft gegenüber Wikimedia widerrufen. Nähere Informationen zur Datenverarbeitung bei Wikimedia und zu meinen Rechten finde ich unter {wikimediaPrivacyPolicy}."
              wikimediaPrivacyPolicy={
                <a href="https://www.wikimedia.de/datenschutz/" target="_blank" rel="noreferrer">
                  wikimedia.de/datenschutz/
                </a>
              }
            />
          </FormCheckBox>
        </Form>
      )}
      {!success && loading && <Loader />}
      {success && !loading && (
        <>
          <span>
            <T _str="Wir haben dir einen Bestätigungslink an die von dir angegebene E-Mail-Adresse geschickt!" />
          </span>
          <div className={styles.success}>
            <CheckCircle />
            <UT _str="<strong>Bitte überprüfe dein Postfach, um deine Anmeldung abzuschließen.</strong>" />
          </div>
        </>
      )}
    </>
  )
}

export default SignupForm
