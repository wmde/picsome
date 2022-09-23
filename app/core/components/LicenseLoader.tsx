import Loader from "./Loader"
import styles from "./LicenseLoader.module.scss"

export type LicenseLoaderProps = {
  headline: string
  url: string
}

const LicenseLoader = (props: LicenseLoaderProps) => {
  const { headline, url, ...rest } = props

  return (
    <section className={styles.loader} {...rest}>
      <h1 className={styles.loader__headline}>{headline}</h1>
      <span className={styles.loader__url}>{decodeURIComponent(url)}</span>
      <div className={styles.loader__spinner}>
        <Loader />
      </div>
    </section>
  )
}

export default LicenseLoader
