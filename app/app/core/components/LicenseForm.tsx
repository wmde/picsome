import { ReactNode, PropsWithoutRef } from "react"
import { Form as FinalForm, FormProps as FinalFormProps } from "react-final-form"
export { FORM_ERROR } from "final-form"
import styles from "./LicenseForm.module.scss"

export interface LicenseFormProps
  extends Omit<PropsWithoutRef<JSX.IntrinsicElements["form"]>, "onSubmit"> {
  children?: ReactNode
  submitText?: string
  onSubmit: FinalFormProps["onSubmit"]
  initialValues?: FinalFormProps["initialValues"]
}

export function LicenseForm({
  children,
  initialValues,
  submitText,
  onSubmit,
  ...props
}: LicenseFormProps) {
  return (
    <FinalForm
      initialValues={initialValues}
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting, submitError }) => (
        <form onSubmit={handleSubmit} className={styles.form} {...props}>
          {children}

          {submitError && (
            <div role="alert" style={{ color: "red" }}>
              {submitError}
            </div>
          )}

          {submitError && (
            <div role="alert" style={{ color: "red" }}>
              {submitError}
            </div>
          )}

          {submitText && (
            <button type="submit" disabled={submitting} className={styles.button}>
              {submitText}
            </button>
          )}
        </form>
      )}
    />
  )
}

export default LicenseForm
