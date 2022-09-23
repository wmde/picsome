import React, { ReactNode } from "react"
import { Link, RouteUrlObject } from "blitz"
import styles from "./Button.module.scss"
import classNames from "classnames"

export type ButtonProps = {
  href?: string | RouteUrlObject
  children?: JSX.Element | string
  label?: JSX.Element | string
  icon?: ReactNode
  bgcolor?: string
  textcolor?: string
  target?: string
  as?: "primary" | "secondary" | "large" | "tertiary"
  onClick?: () => void
  active?: boolean
  reload?: string | boolean
}

export const Button = (props: ButtonProps) => {
  const {
    icon,
    label,
    bgcolor,
    textcolor,
    children,
    onClick,
    as,
    href,
    target = "_self",
    active = true,
    reload = false,
    ...rest
  } = props

  const style = { "--text": textcolor, "--bg": bgcolor } as React.CSSProperties

  if (href && href !== "") {
    return (
      <Link href={href || "#"}>
        <a
          className={classNames(as ? styles[as] : styles.button, {
            [styles.active as string]: active,
          })}
          style={style}
          target={target}
          {...rest}
        >
          {icon}
          {label && <span className={styles.label}>{label}</span>}
          {children}
        </a>
      </Link>
    )
  }

  const onKeyDownHandler = (e) => {
    if (e.code === "Enter" && onClick) {
      onClick()
    }
  }

  return (
    <a
      className={classNames(styles.trigger, as ? styles[as] : styles.button, {
        [styles.active as string]: active,
      })}
      style={style}
      target={target}
      onClick={onClick}
      onKeyDown={onKeyDownHandler}
      {...rest}
      tabIndex={0}
    >
      {icon}
      {label && <span className={styles.label}>{label}</span>}
      {children}
    </a>
  )
}

export default Button
