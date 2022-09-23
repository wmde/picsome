import classNames from "classnames"
import styles from "./Accordion.module.scss"
import { ReactNode, useState } from "react"
import { useUniqueId } from "../hooks/useUniqueId"
import { AccordionArrow } from "./Icons"

const Accordion = (props: {
  title: string | ReactNode
  children?: ReactNode
  theme?: "general" | "topics" | "collect" | "license" | "error" | "default"
  open?: boolean
}) => {
  const [open, setOpen] = useState(props.open === true)

  const triggerId = useUniqueId()
  const contentId = useUniqueId()

  return (
    <div
      className={classNames(styles.accordion, {
        [styles["accordion--open"] as string]: open,
        [styles[`accordion--${props.theme}`] as string]: props.theme !== undefined,
      })}
    >
      <div className={styles.arrow}>
        <AccordionArrow />
      </div>
      <h3 className={styles.summary}>
        <button
          id={triggerId}
          className={styles.trigger}
          onClick={(event) => setOpen(!open)}
          aria-expanded={open}
          aria-controls={contentId}
        >
          {props.title}
        </button>
      </h3>
      <div
        id={contentId}
        className={styles.drawer}
        role="region"
        aria-labelledby={triggerId}
        aria-hidden={!open}
      >
        <div className={styles.content}>{props.children}</div>
      </div>
    </div>
  )
}

export default Accordion
