import { forwardRef, PropsWithoutRef, ReactNode } from "react"
import { useField } from "react-final-form"
import styles from "./FormCheckBox.module.scss"
import Error from "./Error"
import { useT } from "@transifex/react"

export interface LabeledCheckboxProps extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  /** Field name. */
  name: string
  /** Field label. */
  children?: ReactNode
  /** Field type. Doesn't include radio buttons and checkboxes */
  // type?: "text" | "password" | "email" | "number"
  required?: boolean
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const FormCheckBox = forwardRef<HTMLInputElement, LabeledCheckboxProps>(
  ({ name, children, required, outerProps, ...props }, ref) => {
    const errorText = useT("Du musst die AGB akzeptieren.")

    const validate = (v) => (!!v ? undefined : errorText)
    const {
      input,
      meta: { touched, error, submitError, submitting },
    } = useField(name, {
      type: "checkbox",
      validate: required ? validate : undefined,
    })

    const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError

    return (
      <div {...outerProps} className={styles.container}>
        <label className={styles.label}>
          <input
            {...input}
            disabled={submitting}
            {...props}
            ref={ref}
            className={styles.checkbox}
          />
          <div>{children}</div>
        </label>
        {touched && normalizedError && <Error text={normalizedError} small />}
      </div>
    )
  }
)

export default FormCheckBox
