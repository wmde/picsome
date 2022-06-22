import Grid from "app/core/components/Grid"
import styles from "./Modal.module.scss"
import { Close } from "app/core/components/Icons"
import { ReactNode, SyntheticEvent, useEffect } from "react"

export const Modal = (props: {
  title: string
  children: ReactNode
  onClose?: (event?: SyntheticEvent) => void
}) => {
  const { title, children, onClose } = props

  // Install key down listener closing the modal when escape is pressed
  useEffect(() => {
    const keyDownListener = (event: KeyboardEvent) => {
      if (event.key === "Escape" && onClose) {
        onClose()
        event.preventDefault()
      }
    }
    window.addEventListener("keydown", keyDownListener, true)
    return () => window.removeEventListener("keydown", keyDownListener, true)
  }, [onClose])

  return (
    <div className={styles.modal} aria-modal={true} role="dialog">
      <div className={styles.backdrop} onClick={onClose}></div>
      <div className={styles.centered}>
        <Grid>
          <div className={styles.dialog}>
            <div className={styles.header}>
              <div className={styles.inner}>
                <h2 className={styles.title}>{title}</h2>
              </div>
              {onClose && (
                <button className={styles.close} onClick={onClose}>
                  <Close />
                </button>
              )}
            </div>
            <div className={styles.body}>{children}</div>
          </div>
        </Grid>
      </div>
    </div>
  )
}
