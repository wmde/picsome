import Grid from "./Grid"
import styles from "./HeroHome.module.scss"
import { Resource, License, Tag } from "db"
import { T } from "@transifex/react"
import { Routes } from "blitz"
import Button from "./Button"
import ResourcePreview from "./ResourcePreview"

export type HeroHomeProps = {
  heroImage: Resource & {
    license: License
    tags: Tag[]
  }
  loggedIn: boolean
}

export const HeroHome = (props: HeroHomeProps) => {
  const { heroImage, loggedIn = false } = props

  return (
    <div className={styles.container}>
      <Grid>
        <div className={styles.left}>
          <h2 className={styles.headline}>
            <T _str="Die beste Sammlung frei verwendbarer Bilder im Netz" />
          </h2>
          <p className={styles.subline}>
            <T _str="Qualitätsvolles Bildmaterial. Frei lizenziert. Zum Sammeln, Teilen und Weiterverwenden." />
          </p>
          <div>
            <Button as="primary" href={Routes.ResourcesTaggedPage()}>
              <T _str="Bilder entdecken" />
            </Button>{" "}
            {!loggedIn && (
              <Button as="secondary" href={Routes.LoginPage()}>
                <T _str="Anmelden & Mitmachen!" />
              </Button>
            )}
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.hero__image}>
            <div className={styles.hero__image__helper}>
              <ResourcePreview resource={heroImage} as="hero" addable={true} />
            </div>
          </div>
          {/* <div
            className={styles.hero__attribution}
            dangerouslySetInnerHTML={{ __html: attribution.html }}
          ></div> */}
        </div>
      </Grid>
    </div>
  )
}
