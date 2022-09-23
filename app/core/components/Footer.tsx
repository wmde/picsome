import React from "react"
import { useRouter, Link, Routes } from "blitz"
import { Logo, WikiLogo, Mail, Pen, Heart, Team, Language } from "./Icons"
import styles from "./Footer.module.scss"
import Button from "./Button"
import Grid from "./Grid"
import { useT, T } from "@transifex/react"

enum Languages {
  "Deutsch",
  en = "Deutsch",
  de_DE = "English",
}

const Footer = () => {
  const router = useRouter()

  const imprint = useT("Impressum")
  const disclaimer = useT("Nutzungsbedingungen")
  const privacy = useT("Datenschutz")
  const about = useT("About")

  const newsletter = useT("Newsletter")
  const donate = useT("Spenden")
  const join = useT("Mitmachen")

  return (
    <div className={styles.wrapper}>
      <footer className={styles.curatedCommons}>
        <Grid>
          <ul className={styles.navigation}>
            <li>
              <Link href={router.asPath} locale={router.locale === "de_DE" ? "en" : "de_DE"}>
                <a
                  className={styles.language}
                  onClick={() => {
                    window.Usersnap.init({ locale: router.locale === "de_DE" ? "en" : "de_DE" })
                  }}
                >
                  <Language /> <span>{router.locale && Languages[router.locale]}</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href={Routes.ImpressumPage()}>
                <a>{imprint}</a>
              </Link>
            </li>
            <li>
              <Link href={Routes.NutzungsbedingungenPage()}>
                <a>{disclaimer}</a>
              </Link>
            </li>
            <li>
              <Link href={Routes.PrivacyPolicy()}>
                <a>{privacy}</a>
              </Link>
            </li>
            <li>
              <Link href={Routes.AboutTheProject()}>
                <a>{about}</a>
              </Link>
            </li>
          </ul>
          <div className={styles.logocontainer}>
            <Link href={Routes.Home()}>
              <a>
                <Logo color="#fff" />
              </a>
            </Link>
          </div>
        </Grid>
      </footer>
      <footer className={styles.wikifooter}>
        <Grid>
          <ul className={styles.wiki}>
            <li>
              <Button
                href="https://www.wikimedia.de/newsletter/"
                icon={<Mail />}
                label={newsletter}
                bgcolor="#ffffff"
                textcolor="#252525"
                target="_blank"
              />
            </li>
            <li>
              <Button
                href="https://www.wikimedia.de/spenden/"
                icon={<Heart />}
                label={donate}
                bgcolor="#FDE8F0"
                textcolor="#F21B5A"
                target="_blank"
              />
            </li>
            <li>
              <Button
                href="https://www.wikimedia.de/mitmachen/"
                icon={<Pen />}
                label={join}
                bgcolor="#EEEAFF"
                textcolor="#3A25FF"
                target="_blank"
              />
            </li>
            <li>
              <Button
                href="https://spenden.wikimedia.de/apply-for-membership?piwik_campaign=wm.de_neu&piwik_kwd=mitglieds_btn"
                icon={<Team />}
                label={useT("Mitglied werden")}
                bgcolor="#DCFFF3"
                textcolor="#008758"
                target="_blank"
              />
            </li>
          </ul>
          <div className={styles.project}>
            <span className={styles.label}>
              <T _str="Ein Projekt von" />
            </span>
            <Link href="https://www.wikimedia.de">
              <a target="_blank">
                <WikiLogo />
              </a>
            </Link>
          </div>
        </Grid>
      </footer>
    </div>
  )
}

export default Footer
