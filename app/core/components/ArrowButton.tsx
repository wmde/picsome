import { ReactNode } from "react"
import { Link } from "blitz"
import styles from "./ArrowButton.module.scss"
import { ArrowRight } from "./Icons"
import classNames from "classnames"
import ConditionalWrapper from "./ConditionalWrapper"

export type ArrowButtonProps = {
  children?: ReactNode
  href?: string
  onClick?: () => void
  reverse?: boolean
}

export const ArrowButton = (props: ArrowButtonProps) => {
  const { children, href = "#", onClick = () => {}, reverse = false } = props

  return (
    <ConditionalWrapper
      condition={href !== "#"}
      wrapper={(children) => <Link href={href}>{children}</Link>}
    >
      <a
        className={classNames(styles.button, {
          [styles.button__reverse as string]: reverse,
        })}
        onClick={() => {
          onClick()
        }}
      >
        <span>{children}</span>
        <ArrowRight />
      </a>
    </ConditionalWrapper>
  )
}
