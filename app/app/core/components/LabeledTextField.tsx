import { useT } from "@transifex/react"
import { forwardRef, PropsWithoutRef } from "react"
import { useField, UseFieldConfig } from "react-final-form"
import styles from "./LabeledTextField.module.scss"
import Error from "./Error"
export interface LabeledTextFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  /** Field name. */
  name: string
  /** Field label. */
  label?: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  required?: boolean
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const LabeledTextField = forwardRef<HTMLInputElement, LabeledTextFieldProps>(
  ({ name, label, required = false, outerProps, ...props }, ref) => {
    const errorText = useT("Das ist ein Pflichtfeld")

    const validate = (v) => (!!v ? undefined : errorText)
    const config: UseFieldConfig<string | number> = {
      parse: props.type === "number" ? Number : undefined,
      validate: required ? validate : undefined,
    }
    const {
      input,
      meta: { touched, error, submitError, submitting },
    } = useField(name, config)

    const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError

    return (
      <div {...outerProps}>
        <label className={styles.label}>
          {label && <span>{label}</span>}
          <input
            {...input}
            disabled={submitting}
            {...props}
            ref={ref}
            className={styles.background}
          />
        </label>

        {touched && normalizedError && <Error text={normalizedError} small />}
      </div>
    )
  }
)

export default LabeledTextField
