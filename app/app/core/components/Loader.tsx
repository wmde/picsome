import styles from "./Loader.module.scss"

export type LoaderProps = {}

export const Loader = (props: LoaderProps) => {
  return (
    <div className={styles.loader} {...props}>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
    </div>
  )
}

export default Loader
