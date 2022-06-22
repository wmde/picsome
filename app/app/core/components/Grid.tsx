import { ReactNode } from "react"
import styles from "./Grid.module.scss"

type GridProps = {
  children: ReactNode
  modifier?: string
}

const Grid = (props: GridProps) => {
  const { children, modifier } = props

  const classes = [styles.grid, modifier && styles[modifier]].join(" ")

  return (
    <div className={styles.container}>
      <div className={classes}>{children}</div>
    </div>
  )
}

export default Grid
