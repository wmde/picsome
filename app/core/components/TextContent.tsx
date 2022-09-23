import styles from "./TextContent.module.scss"
import { UT } from "@transifex/react"
export type TextContentProps = {
  content: string
}

export const TextContent = (props: TextContentProps) => {
  const { content, ...rest } = props

  return (
    <div className={styles.content} {...props}>
      <UT _str={content} />
    </div>
  )
}

export default TextContent
