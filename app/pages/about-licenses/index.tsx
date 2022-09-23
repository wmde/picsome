import { BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import Grid from "app/core/components/Grid"
import TextContent from "app/core/components/TextContent"
import { T, useT, UT } from "@transifex/react"
import styles from "./about-licenses.module.scss"
import {
  AboutLicensesIcon,
  Pikto0,
  PiktoCC,
  PiktoC,
  PiktoND,
  PiktoNC,
  PiktoSA,
  PiktoBY,
} from "app/core/components/Icons"
import { CheckCircle, WarningCircle, ForbiddenCircle } from "app/core/components/Icons"
import classNames from "classnames"

const content = `
Die Bilder, die auf freien Medienarchiven wie beispielsweise <a href="https://commons.wikimedia.org/wiki/Main_Page?uselang=de" target="_blank">Wikimedia Commons</a> veröffentlicht werden, sind in vielen Fällen urheberrechtlich geschützt – durch ihre Urheber*innen aber zumeist zur Nutzung freigegeben worden. Dies ist möglich durch die Verwendung so genannter freier Lizenzen, wie z. B. <a href="https://creativecommons.org/licenses/?lang=de" target="_blank" />Creative-Commons-Lizenzen</a>. Ein gewisser Anteil ist sogar komplett rechtefrei <a href="https://de.wikipedia.org/wiki/Gemeinfreiheit" target="_blank">(Public Domain)</a>. <br /><br />
Gilt im Urheberrecht im Normalfall „alle Rechte vorbehalten", so wird daraus durch freie Lizenzen ein „manche Rechte vorbehalten“. Viele Nutzungen, wie zum Beispiel Bearbeitungen oder die Weitergabe von Werken, sind in diesem Fall dann vorab für alle erlaubt, ohne dass es noch weiterer individueller Absprachen mit den Urheber*innen bedarf – solange die jeweiligen Lizenzbedingungen eingehalten werden. <br /> <br />
<strong>picsome</strong> hilft dir, frei lizenzierte Bilder zu verwenden und die Lizenzbedingungen bei der Nachnutzung einzuhalten. Dies funktioniert, indem die Anwendung bei der Erstellung des Lizenzhinweises unterstützt. So kannst du schnell und einfach den entsprechenden Lizenzhinweis auf verschiedene Arten kopieren und in deine Publikation einfügen. Zusätzlich zeigt dir die Anwendung, welche Verwendungsmöglichkeiten dir die jeweilige Lizenz einräumt – ob du das Bild also teilen, bearbeiten oder kommerziell nutzen darfst.
`

const AboutLicenses: BlitzPage = () => {
  const translation = useT(content)

  return (
    <>
      <div className={styles.explain}>
        <Grid>
          <div className={styles.explain__inner}>
            <div className={styles.explain__left}>
              <h2>
                <T _str="Was bewirken CC-Lizenzen rechtlich?" />
              </h2>
              <TextContent content={translation} />
            </div>
            <div className={styles.explain__right}>
              <AboutLicensesIcon />
            </div>
          </div>
        </Grid>
      </div>
      <div className={styles.overview}>
        <Grid>
          <h2 className={styles.overview__headline}>
            <T _str="CC-Lizenzen im Überblick" />
          </h2>
        </Grid>

        <div className={styles.overview__tableContainer}>
          <Grid>
            <div className={styles.overview__tableHeader}>
              <div className={styles.overview__tableIcon}>
                <h4>
                  <T _str="Piktogramm" />
                </h4>
              </div>
              <div className={styles.overview__tableName}>
                <h4>
                  <T _str="Name" />
                </h4>
              </div>
              <div className={styles.overview__tableFeatures}>
                <h4>
                  <T _str="Du darfst:" />
                </h4>
              </div>
              <div className={styles.overview__tableTerms}>
                <h4>
                  <T _str="Achte darauf:" />
                </h4>
              </div>
            </div>
            <div className={styles.overview__table}>
              <div className={styles.overview__tableInner}>
                {/* CC 0 */}
                <div
                  className={classNames(styles.overview__tableRow, {
                    [styles["overview__tableRow--primary"] as string]: true,
                  })}
                >
                  <div className={styles.overview__tablePiktoContainer}>
                    <span className={styles.overview__tablePikto}>
                      <PiktoCC /> CC
                    </span>
                    <span className={styles.overview__tablePikto}>
                      <Pikto0 /> CC0
                    </span>
                  </div>
                  <div className={styles.overview__tablePiktoName}>
                    <T _str="CC0" />
                  </div>
                  <div className={styles.overview__tableFeatures}>
                    <div>
                      <CheckCircle />
                      <span>
                        <T _str="Kommerziell nutzen" />
                      </span>
                    </div>
                    <div>
                      <CheckCircle />
                      <span>
                        <T _str="Teilen" />
                      </span>
                    </div>
                    <div>
                      <CheckCircle />
                      <span>
                        <T _str="Bearbeiten" />
                      </span>
                    </div>
                  </div>
                  <div className={styles.overview__tableTerms}></div>
                </div>
                {/* END CC 0 */}

                {/* CC-BY */}
                <div
                  className={classNames(styles.overview__tableRow, {
                    [styles["overview__tableRow--primary"] as string]: true,
                  })}
                >
                  <div className={styles.overview__tablePiktoContainer}>
                    <span className={styles.overview__tablePikto}>
                      <PiktoCC /> CC
                    </span>
                    <span className={styles.overview__tablePikto}>
                      <PiktoBY /> BY
                    </span>
                  </div>
                  <div className={styles.overview__tablePiktoName}>
                    <T _str="CC BY" />
                  </div>
                  <div className={styles.overview__tableFeatures}>
                    <div>
                      <CheckCircle />
                      <span>
                        <T _str="Kommerziell nutzen" />
                      </span>
                    </div>
                    <div>
                      <CheckCircle />
                      <span>
                        <T _str="Teilen" />
                      </span>
                    </div>
                    <div>
                      <CheckCircle />
                      <span>
                        <T _str="Bearbeiten" />
                      </span>
                    </div>
                  </div>
                  <div className={styles.overview__tableTerms}>
                    <div>
                      <WarningCircle />
                      <span>
                        <T _str="Namensnennung" />
                      </span>
                    </div>

                    <div>
                      <WarningCircle />
                      <span>
                        <T _str="Bearbeitungen angeben" />
                      </span>
                    </div>
                  </div>
                </div>
                {/* END CC-BY */}

                {/* CC-BY-SA */}
                <div
                  className={classNames(styles.overview__tableRow, {
                    [styles["overview__tableRow--primary"] as string]: true,
                  })}
                >
                  <div className={styles.overview__tablePiktoContainer}>
                    <span className={styles.overview__tablePikto}>
                      <PiktoCC /> CC
                    </span>
                    <span className={styles.overview__tablePikto}>
                      <PiktoBY /> BY
                    </span>
                    <span className={styles.overview__tablePikto}>
                      <PiktoSA /> SA
                    </span>
                  </div>
                  <div className={styles.overview__tablePiktoName}>
                    <T _str="CC BY-SA" />
                  </div>
                  <div className={styles.overview__tableFeatures}>
                    <div>
                      <CheckCircle />
                      <span>
                        <T _str="Kommerziell nutzen" />
                      </span>
                    </div>
                    <div>
                      <CheckCircle />
                      <span>
                        <T _str="Teilen" />
                      </span>
                    </div>
                    <div>
                      <CheckCircle />
                      <span>
                        <T _str="Bearbeiten" />
                      </span>
                    </div>
                  </div>
                  <div className={styles.overview__tableTerms}>
                    <div>
                      <WarningCircle />
                      <span>
                        <T _str="Namensnennung" />
                      </span>
                    </div>
                    <div>
                      <WarningCircle />
                      <span>
                        <T _str="Weitergabe unter gleichen Bedingungen" />
                      </span>
                    </div>
                    <div>
                      <WarningCircle />
                      <span>
                        <T _str="Bearbeitungen angeben" />
                      </span>
                    </div>
                  </div>
                </div>
                {/* END CC-BY-SA */}

                {/* CC-BY-NC */}
                <div
                  className={classNames(styles.overview__tableRow, {
                    [styles["overview__tableRow--secondary"] as string]: true,
                  })}
                >
                  <div className={styles.overview__tablePiktoContainer}>
                    <span className={styles.overview__tablePikto}>
                      <PiktoCC /> CC
                    </span>
                    <span className={styles.overview__tablePikto}>
                      <PiktoBY /> BY
                    </span>
                    <span className={styles.overview__tablePikto}>
                      <PiktoNC /> NC
                    </span>
                  </div>
                  <div className={styles.overview__tablePiktoName}>
                    <T _str="CC BY-NC" />
                  </div>
                  <div className={styles.overview__tableFeatures}>
                    <div>
                      <CheckCircle />
                      <span>
                        <T _str="Teilen" />
                      </span>
                    </div>
                    <div>
                      <CheckCircle />
                      <span>
                        <T _str="Bearbeiten" />
                      </span>
                    </div>
                  </div>
                  <div className={styles.overview__tableTerms}>
                    <div>
                      <WarningCircle />
                      <span>
                        <T _str="Namensnennung" />
                      </span>
                    </div>
                    <div>
                      <WarningCircle />
                      <span>
                        <T _str="Weitergabe unter gleichen Bedingungen" />
                      </span>
                    </div>
                    <div>
                      <WarningCircle />
                      <span>
                        <T _str="Bearbeitungen angeben" />
                      </span>
                    </div>

                    <div>
                      <ForbiddenCircle />
                      <span>
                        <T _str="Keine kommerzielle Nutzung" />
                      </span>
                    </div>
                  </div>
                </div>
                {/* END CC-BY-NC */}

                {/* CC-BY-NC-SA */}
                <div
                  className={classNames(styles.overview__tableRow, {
                    [styles["overview__tableRow--secondary"] as string]: true,
                  })}
                >
                  <div className={styles.overview__tablePiktoContainer}>
                    <span className={styles.overview__tablePikto}>
                      <PiktoCC /> CC
                    </span>
                    <span className={styles.overview__tablePikto}>
                      <PiktoBY /> BY
                    </span>
                    <span className={styles.overview__tablePikto}>
                      <PiktoNC /> NC
                    </span>
                    <span className={styles.overview__tablePikto}>
                      <PiktoSA /> SA
                    </span>
                  </div>
                  <div className={styles.overview__tablePiktoName}>
                    <T _str="CC BY-NC-SA" />
                  </div>
                  <div className={styles.overview__tableFeatures}>
                    <div>
                      <CheckCircle />
                      <span>
                        <T _str="Teilen" />
                      </span>
                    </div>
                    <div>
                      <CheckCircle />
                      <span>
                        <T _str="Bearbeiten" />
                      </span>
                    </div>
                  </div>
                  <div className={styles.overview__tableTerms}>
                    <div>
                      <WarningCircle />
                      <span>
                        <T _str="Namensnennung" />
                      </span>
                    </div>
                    <div>
                      <ForbiddenCircle />
                      <span>
                        <T _str="Keine kommerzielle Nutzung" />
                      </span>
                    </div>
                    <div>
                      <WarningCircle />
                      <span>
                        <T _str="Weitergabe unter gleichen Bedingungen" />
                      </span>
                    </div>
                    <div>
                      <WarningCircle />
                      <span>
                        <T _str="Bearbeitungen angeben" />
                      </span>
                    </div>
                  </div>
                </div>
                {/* END CC-BY-NC-SA */}

                {/* CC-BY-ND */}
                <div
                  className={classNames(styles.overview__tableRow, {
                    [styles["overview__tableRow--secondary"] as string]: true,
                  })}
                >
                  <div className={styles.overview__tablePiktoContainer}>
                    <span className={styles.overview__tablePikto}>
                      <PiktoCC /> CC
                    </span>
                    <span className={styles.overview__tablePikto}>
                      <PiktoBY /> BY
                    </span>
                    <span className={styles.overview__tablePikto}>
                      <PiktoND /> ND
                    </span>
                  </div>
                  <div className={styles.overview__tablePiktoName}>
                    <T _str="CC BY-ND" />
                  </div>
                  <div className={styles.overview__tableFeatures}>
                    <div>
                      <CheckCircle />
                      <span>
                        <T _str="Teilen" />
                      </span>
                    </div>
                  </div>
                  <div className={styles.overview__tableTerms}>
                    <div>
                      <WarningCircle />
                      <span>
                        <T _str="Namensnennung" />
                      </span>
                    </div>
                    <div>
                      <ForbiddenCircle />
                      <span>
                        <T _str="Keine Bearbeitung" />
                      </span>
                    </div>
                  </div>
                </div>
                {/* END CC-BY-ND */}

                {/* CC-BY-NC-ND */}
                <div
                  className={classNames(styles.overview__tableRow, {
                    [styles["overview__tableRow--secondary"] as string]: true,
                  })}
                >
                  <div className={styles.overview__tablePiktoContainer}>
                    <span className={styles.overview__tablePikto}>
                      <PiktoCC /> CC
                    </span>
                    <span className={styles.overview__tablePikto}>
                      <PiktoBY /> BY
                    </span>
                    <span className={styles.overview__tablePikto}>
                      <PiktoNC /> NC
                    </span>
                    <span className={styles.overview__tablePikto}>
                      <PiktoND /> ND
                    </span>
                  </div>
                  <div className={styles.overview__tablePiktoName}>
                    <T _str="CC BY-NC-ND" />
                  </div>
                  <div className={styles.overview__tableFeatures}>
                    <div>
                      <CheckCircle />
                      <span>
                        <T _str="Teilen" />
                      </span>
                    </div>
                  </div>
                  <div className={styles.overview__tableTerms}>
                    <div>
                      <WarningCircle />
                      <span>
                        <T _str="Namensnennung" />
                      </span>
                    </div>
                    <div>
                      <ForbiddenCircle />
                      <span>
                        <T _str="Keine kommerzielle Nutzung" />
                      </span>
                    </div>
                    <div>
                      <ForbiddenCircle />
                      <span>
                        <T _str="Keine Bearbeitung" />
                      </span>
                    </div>
                  </div>
                </div>
                {/* END CC-BY-NC-ND */}

                {/* COPYRIGHT */}
                <div
                  className={classNames(styles.overview__tableRow, {
                    [styles["overview__tableRow--copyright"] as string]: true,
                  })}
                >
                  <div className={styles.overview__tablePiktoContainer}>
                    <span className={styles.overview__tablePikto}>
                      <PiktoC /> C
                    </span>
                  </div>
                  <div className={styles.overview__tablePiktoName}>
                    <T _str="Copyright" />
                  </div>
                  <div className={styles.overview__tableFeatures}>{/*  */}</div>
                  <div className={styles.overview__tableTerms}>
                    <div>
                      <WarningCircle />
                      <span>
                        <T _str="Alle Rechte vorbehalten" />
                      </span>
                    </div>
                    <div>
                      <ForbiddenCircle />
                      <span>
                        <T _str="Keine Bearbeitung" />
                      </span>
                    </div>
                    <div>
                      <ForbiddenCircle />
                      <span>
                        <T _str="Keine kommerzielle Nutzung" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
        </div>
      </div>
      <Grid>
        <p className={styles.label}>
          <T _str="Diese Anwendung soll die lizenzkonforme Nachnutzung von bestimmten urheberrechtlich geschützten Bildern vereinfachen. Sie kann niemals alle möglichen Anwendungsfälle und Besonderheiten abdecken und ersetzt in keinem Fall die qualifizierte juristische Beratung." />{" "}
        </p>
      </Grid>
    </>
  )
}

AboutLicenses.suppressFirstRenderFlicker = true
AboutLicenses.getLayout = (page) => <Layout title="About Licenses">{page}</Layout>

export default AboutLicenses
