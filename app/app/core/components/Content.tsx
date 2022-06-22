import styles from "./Content.module.scss"
import { UT } from "@transifex/react"
import { ReactNode } from "react"

export type ContentProps = {
  children: ReactNode
}

export const Content = (props: ContentProps) => {
  const { children } = props

  return (
    <div className={styles.content} {...props}>
      {children}
    </div>
  )
}

export default Content
