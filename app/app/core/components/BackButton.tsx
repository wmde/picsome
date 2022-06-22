import { ReactNode, MouseEvent } from "react"
import { useRouter } from "blitz"
import styles from "./BackButton.module.scss"
import { Back } from "./Icons"

export type BackButtonProps = {
  children?: ReactNode
}

export const BackButton = (props: BackButtonProps) => {
  const router = useRouter()
  const { children } = props

  // const goBack = (e: MouseEvent) => {
  //   e.preventDefault()
  //   router.back()
  // }

  return (
    <a
      className={styles.back}
      href="#"
      onClick={() => {
        router.back()
      }}
    >
      <Back />
      <span>{children}</span>
    </a>
  )
}
