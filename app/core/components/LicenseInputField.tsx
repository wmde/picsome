import { forwardRef, PropsWithoutRef } from "react"
import { useField } from "react-final-form"
import styles from "./LicenseInputField.module.scss"
import { Link } from "./Icons"

export interface LicenseInputProps extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  /** Field name. */
  name: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type: "text"
  placeholder: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const LicenseInputField = forwardRef<HTMLInputElement, LicenseInputProps>(
  ({ name, outerProps, placeholder, ...props }, ref) => {
    const {
      input,
      meta: { touched, error, submitError, submitting },
    } = useField(name)

    const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError

    return (
      <div {...outerProps} className={styles.container}>
        <div className={styles.icon}>
          <Link />
        </div>
        <input
          {...input}
          disabled={submitting}
          placeholder={placeholder}
          {...props}
          ref={ref}
          className={styles.search}
        />

        {touched && normalizedError && (
          <div role="alert" style={{ color: "red" }}>
            {normalizedError}
          </div>
        )}
      </div>
    )
  }
)

export default LicenseInputField
