import styles from "./BackButton.module.scss"
import { Back } from "./Icons"
import { ReactNode, MouseEvent } from "react"
import { useRouter } from "blitz"

export const BackButton = (props: { children?: ReactNode }) => {
  const router = useRouter()

  const onClick = (event: MouseEvent) => {
    event.preventDefault()
    router.back()
  }

  return (
    <button className={styles["back-button"]} onClick={onClick}>
      <Back />
      <span>{props.children}</span>
    </button>
  )
}
