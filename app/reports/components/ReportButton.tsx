export { FORM_ERROR } from "app/core/components/Form"
import React, { useState } from "react"
import createReport, { createReportInputSchema } from "app/reports/mutations/createReport"
import styles from "./ReportButton.module.scss"
import { Field, Form } from "react-final-form"
import { Flag, Close, Back } from "app/core/components/Icons"
import { ReportReason } from "db"
import { T } from "@transifex/react"
import { useMutation, validateZodSchema, useRouter, Router, Routes } from "blitz"

type ReportButtonProps = {
  resourceId?: number
  collectionId?: number
}

const ReportReasonTranslations = {
  de_DE: ["Urheberrechtsverletzung", "Anstößiger oder nicht jugendfreier Inhalt", "Anderer Grund"],
  en: ["Verletzung des Urheberrechts", "Enthält Inhalt für Erwachsene", "Anderer Grund"],
}

const EnumToArray = (enumInput): Array<any> => {
  return Object.keys(enumInput).map((key) => enumInput[key])
}

export default function ReportButton(props: ReportButtonProps) {
  const [expanded, setExpanded] = useState(false)
  const [step, setStep] = useState(0)
  const [reason, setReason] = useState("")

  const router = useRouter()

  const locale = router.locale || "de"

  const ReportReasonArray = EnumToArray(ReportReason)

  const [createReportMutation] = useMutation(createReport, {
    onSuccess: () => setStep(2),
    onError: () => setStep(3),
  })

  const close = () => {
    setReason("")
    setStep(0)
    setExpanded(!expanded)
  }

  const onSubmitHandler = async (values) => {
    try {
      const reasonIndex = ReportReasonTranslations[locale].indexOf(values.reason)
      values.reason = ReportReasonArray[reasonIndex]
      values.message = values.message || ""
      await createReportMutation({
        ...values,
        resourceId: props.resourceId,
        collectionId: props.collectionId,
      })
      Router.push(Routes.Home())
    } catch (e) {
      console.error(e)
    }
  }

  const stepHandler = () => {
    setStep(1)
  }

  const changeHandler = (event: any) => {
    if (event.target) {
      setReason(event.target.value)
    }
  }

  return (
    <div className={styles.container}>
      <button className={styles.report} onClick={close}>
        <Flag />
        <span>
          <T _str="Inhalt melden" />
        </span>
      </button>
      <div className={expanded ? styles.form_container : styles.hidden}>
        <div className={styles.arrow}></div>
        <div className={styles.form_inner}>
          <div onClick={close} className={styles.close}>
            <Close />
          </div>
          <h3>
            <T _str="Inhalt melden" />
          </h3>
          <Form
            validate={validateZodSchema(createReportInputSchema)}
            onSubmit={onSubmitHandler}
            render={({ handleSubmit, submitting, submitError }) => (
              <form onSubmit={handleSubmit} onChange={changeHandler}>
                {submitError}
                <div className={step === 0 ? styles.form : styles.hidden}>
                  <p className={styles.reportlabel}>
                    <T _str="Hilf uns dabei, das Problem zu verstehen. Warum möchtest du diesen Inhalt melden?" />
                  </p>
                  <div className={styles.reasons}>
                    {ReportReasonTranslations[locale] &&
                      ReportReasonTranslations[locale].map((value, index) => {
                        return (
                          <label key={index} className={styles.label}>
                            <Field
                              name="reason"
                              component="input"
                              type="radio"
                              value={value}
                              className={styles.radio}
                              checked={value === reason}
                            />
                            {value}
                          </label>
                        )
                      })}
                  </div>
                  <div className={styles.button} onClick={() => stepHandler()}>
                    <T _str="Weiter" />
                  </div>
                </div>
                <div className={step === 1 ? styles.form : styles.hidden}>
                  <div>
                    <label>
                      <T _str="Warum möchtest du diesen Inhalt melden?" />
                    </label>
                    <Field
                      name="message"
                      component="textarea"
                      placeholder="Deine Beschreibung des Problems ..."
                      className={styles.textarea}
                    />
                  </div>
                  <div className={styles.buttons}>
                    <div onClick={() => setStep(0)} className={styles.back}>
                      <Back />
                      <T _str="Zurück" />
                    </div>
                    <button type="submit" disabled={submitting} className={styles.button}>
                      <T _str="Weiter" />
                    </button>
                  </div>
                </div>
                <div className={step === 2 ? styles.form : styles.hidden}>
                  <div>
                    <p>
                      <T _str="Vielen Dank, dass du ein Problem mit diesem Inhalt gemeldet hast!" />
                    </p>
                    <p>
                      <T _str="Wir empfehlen, dasselbe bei der Quelle des Inhalts zu tun." />
                    </p>
                  </div>
                </div>
                <div className={step === 3 ? styles.form : styles.hidden}>
                  <div>
                    <p>
                      <T _str="Es ist ein Fehler aufgetreten!" />
                    </p>
                    <p>
                      <T _str="Bitte versuche es erneut." />
                    </p>
                  </div>
                </div>
              </form>
            )}
          />
        </div>
      </div>
    </div>
  )
}
