import styles from "./Error.module.scss"
import classNames from "classnames"

export type ErrorProps = {
  text: string | JSX.Element
  description?: string | JSX.Element
  small?: boolean
}

export const Error = (props: ErrorProps) => {
  const { text, description, small } = props
  return (
    <div
      className={classNames(styles.error, {
        [styles.small as string]: small,
      })}
    >
      <p>{text}</p>
      {description !== undefined && <p>{description}</p>}
    </div>
  )
}

export default Error
