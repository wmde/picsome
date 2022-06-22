import styles from "./Error.module.scss"
import { T } from "@transifex/react"
import classNames from "classnames"

export type ErrorProps = {
  text: string
  description?: string
  small?: boolean
}

export const Error = (props: ErrorProps) => {
  const { text, description, small } = props

  return (
    <div className={classNames(styles.error, { [styles.small as string]: small })}>
      <p>
        <T _str={text} />
      </p>
      {description && (
        <p>
          <T _str={description} />
        </p>
      )}
    </div>
  )
}

export default Error
