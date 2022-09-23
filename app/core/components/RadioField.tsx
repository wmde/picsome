import ReactTooltip from "react-tooltip"
import styles from "./RadioField.module.scss"
import { Field } from "react-final-form"
import { HelpIcon } from "./Icons"
import { ReactNode } from "react"

export type RadioFieldOptions = {
  value: string
  label: string | JSX.Element
  description?: string | JSX.Element
}[]

const RadioField = (props: { options: RadioFieldOptions; name: string; label?: ReactNode }) => {
  const { options, name, label } = props
  return (
    <div className={styles.field}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.options}>
        {options.map((option, index) => (
          <label key={index} className={styles.option}>
            <Field name={name} type="radio" value={option.value}>
              {(props) => <input className={styles.optionInput} {...props.input} />}
            </Field>
            <span className={styles.optionText}>{option.label}</span>
            {option.description && (
              <span className={styles.optionHelp} data-tip={option.description}>
                <HelpIcon />
              </span>
            )}
          </label>
        ))}
        <ReactTooltip
          key="tooltip"
          type="light"
          effect="solid"
          place="bottom"
          multiline={true}
          className={styles.tooltip}
        />
      </div>
    </div>
  )
}

export default RadioField
