import styles from "./InputStageModule.module.scss"
import Grid from "./Grid"
import classNames from "classnames"
import LicenseForm from "./LicenseForm"
import LicenseInputField from "./LicenseInputField"
import { useCallback, useState } from "react"
import { isUrl } from "integrations/license-check/libs/utils"
import Error from "./Error"
import { useT } from "@transifex/react"

export type LogoElementArray = {
  url: string
  el: JSX.Element
}

const InputStageModule = (props: {
  theme: "license" | "import"
  headline: string | JSX.Element
  copy: string | JSX.Element
  error?: string
  logos: LogoElementArray[]
  //logos?: JSX.Element[]
  children?: React.ReactNode
  inputPlaceholder?: string
  submitLabel?: string
  onSubmit: (url: string) => void
}) => {
  const [inputError, setInputError] = useState(false)

  const onFormSubmit = useCallback(
    (values) => {
      const url = values.url
      if (!isUrl(url)) {
        setInputError(true)
      } else {
        setInputError(false)
        props.onSubmit(url)
      }
    },
    [props]
  )

  const defaultPlaceholder = useT("URL eingeben…")

  return (
    <section
      className={classNames(styles["input-stage-module"], {
        [styles["input-stage-module--" + props.theme] as string]: true,
      })}
    >
      <Grid>
        <div className={styles["input-stage-module__start"]}>
          <h1 className={styles["input-stage-module__headline"]}>{props.headline}</h1>
          <div>
            <LicenseForm onSubmit={onFormSubmit} submitText={props.submitLabel}>
              <LicenseInputField
                name="url"
                type="text"
                placeholder={props.inputPlaceholder ?? defaultPlaceholder}
              />
            </LicenseForm>
            {inputError && <Error text="Ungültige URL - bitte versuche es erneut" />}
            {props.error && <Error text={props.error} />}
          </div>
          <span className={styles["input-stage-module__copy"]}>{props.copy}</span>
          {props.logos !== undefined && props.logos?.length > 0 && (
            <ul className={styles["input-stage-module__logos"]}>
              {props.logos.map((logo, index) => (
                <li key={index} className={styles["input-stage-module__logo"]}>
                  <a href={logo.url} target="_blank" rel="noreferrer">
                    {logo.el}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={styles["input-stage-module__end"]}>{props.children}</div>
      </Grid>
    </section>
  )
}

export default InputStageModule
