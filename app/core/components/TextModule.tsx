import styles from "./TextModule.module.scss"
import Grid from "./Grid"
import { UT, T } from "@transifex/react"
import Button from "./Button"

export type TextModuleProps = {
  headline: string
  content: string
  ctaurl: string
  ctatext: string
}

export const TextModule = (props: TextModuleProps) => {
  const { headline, content, ctaurl, ctatext } = props

  return (
    <Grid>
      <div className={styles.container}>
        <h2 className={styles.headline}>
          <T _str={headline} />
        </h2>
        <div className={styles.content}>
          <UT _str={content} />
        </div>
        <div className={styles.button}>
          <Button href={ctaurl} as="primary">
            <T _str={ctatext} />
          </Button>
        </div>
      </div>
    </Grid>
  )
}
