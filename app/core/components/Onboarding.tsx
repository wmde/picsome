import styles from "./Onboarding.module.scss"
import { T, UT } from "@transifex/react"
import classNames from "classnames"
import Grid from "./Grid"
import Button from "./Button"
import { Close } from "./Icons"
import { useState, useEffect } from "react"
import { Image } from "blitz"

import welcome from "../../../public/onboarding/welcome.png"
import tags from "../../../public/onboarding/tags.png"
import mytags from "../../../public/onboarding/my-tags.png"
import othertags from "../../../public/onboarding/other-tags.png"
import jointcollections1 from "../../../public/onboarding/joint-collections-1.png"
import jointcollections2 from "../../../public/onboarding/joint-collections-2.png"
import licensecheck1 from "../../../public/onboarding/license-check-1.png"
import licensecheck2 from "../../../public/onboarding/license-check-2.png"
import multiImport from "../../../public/onboarding/multi-import.png"
import smartcollection from "../../../public/onboarding/smart-collection.png"
import finish from "../../../public/onboarding/finish.png"

export type OnboardingProps = {
  onClose: () => void
  onFinish: () => void
}

export const Onboarding = (props: OnboardingProps) => {
  const { onClose, onFinish } = props

  const onboardingSlides = [
    {
      headline: <T _str="Willkommen zu deiner Onboarding Tour!" />,
      content: (
        <>
          <UT _str="<p>Schön, dass du hier bist. Wir zeigen dir in nur wenigen Schritten, wie du picsome benutzen kannst. Viel Spaß!</p>" />
          <T
            _str=" {image} "
            image={<Image src={welcome} alt="Onboarding Welcome" width="300" height="300" />}
          />
        </>
      ),
    },
    {
      headline: <T _str="Bilder mit eigenen Tags versehen" />,
      content: (
        <>
          <UT _str="<p>Bilder können mit Tags versehen werden, um diese in der Suche besser auffindbar zu machen und Bilder untereinander zu verknüpfen. Wenn du Bilder zu picsome hinzufügst, kannst du direkt auch passende Tags ergänzen, so ist das Tagging quasi schon erledigt und dein Bild kann besser von anderen gefunden werden.</p>" />
          <T _str=" {image} " image={<Image src={othertags} alt="Onboarding Other Tags" />} />
          <UT _str="<p>Einige Bilder enthalten bereits Tags von anderen Nutzer*innen. Du kannst weitere passende Tags über die Funktion “Tags hinzufügen” ergänzen (oder über das kleine Kreuz wieder entfernen). Auf der Startseite findest du die Kategorie “Bildersuche verbessern”. Hier befinden sich alle Bilder, die sich freuen, von dir mit Tags versehen zu werden. So kannst du dabei helfen, die Suche für alle zu verbessern! </p>" />
          <T _str=" {image} " image={<Image src={mytags} alt="Onboarding My Tags" />} />
        </>
      ),
    },
    {
      headline: <T _str="Suche nach (mehreren) Tags" />,
      content: (
        <>
          <UT _str="<p>picsome setzt <a href='https://www.wikidata.org/wiki/Wikidata:Introduction/de' target='_blank' />Wikidata</a> zum Suchen und Taggen der Bilder ein. Wenn du einen Suchbegriff in die Suchmaske eingibst, schlägt picsome dir automatisch einen Wikidata-Begriff vor, den du mit “Enter” bestätigen und so die Suche starten kannst. </p><p>Um noch genauere Suchergebnisse zu erhalten, kannst du picsome mithilfe mehrerer Tags durchsuchen: Einfach das gewünschte Tag ins Suchfeld eingeben, mit Enter bestätigen und weitere Tags ergänzen. Per Klick auf das kleine Kreuz lassen sich einzelne Tags auch wieder ganz leicht entfernen.</p>" />
          <T _str=" {image} " image={<Image src={tags} alt="Onboarding Multiple Tags" />} />
        </>
      ),
    },
    {
      headline: <T _str="Bilder alleine oder gemeinsam sammeln" />,
      content: (
        <>
          <T
            _str=" {image} "
            image={<Image src={jointcollections1} alt="Onboarding My Collections" />}
          />
          <UT _str="<p>Du kannst auf picsome Sammlungen anlegen und/oder Bilder zu bestehenden Sammlungen hinzufügen, wenn diese entweder über die eingebaute Suche gefunden oder über den Lizenzchecker analysiert werden konnten.</p>" />
          <T
            _str=" {image} "
            image={<Image src={jointcollections2} alt="Onboarding Joint Collections" />}
          />
          <UT _str="<p>Wenn dir ein Bild gefällt, kannst du es über die Funktion “Bild sammeln” entweder zu einer bestehenden Sammlung hinzufügen oder eine neue Sammlung erstellen. Du kannst entscheiden, ob du allein sammeln möchtest oder andere Nutzer*innen zu deiner Sammlung beitragen können. Sammlungen lassen sich auch per Link mit anderen Menschen teilen und so als offene Galerie nutzen. </p>" />
        </>
      ),
    },
    {
      headline: <T _str="Lizenzbedingungen prüfen" />,
      content: (
        <>
          <T
            _str=" {image} "
            image={<Image src={licensecheck1} alt="Onboarding My Collections" />}
          />
          <UT _str="<p>Der Lizenzchecker unterstützt derzeit frei lizenzierte Bilder von Wikimedia Commons sowie von Flickr. Bild-URLs dieser beiden Plattformen können in den Lizenzchecker gegeben werden. Verlinke einfach das Bild, das du verwenden möchtest und lass dir von picsome den passenden Lizenzhinweis erstellen. Dieser zeigt dann an, wie Bilder lizenzkonform verwendet werden können. So kannst du das Bild entsprechend der Lizenzbedingungen verwenden, mit anderen teilen und sammeln.</p>" />
          <T
            _str=" {image} "
            image={<Image src={licensecheck2} alt="Onboarding Joint Collections" />}
          />
        </>
      ),
    },
    {
      headline: <T _str="Smarte Sammlungen" />,
      content: (
        <>
          <T
            _str=" {image} "
            image={<Image src={smartcollection} alt="Onboarding Smart Collection" />}
          />
          <UT _str="<p>Jede neue Sammlung, die du anlegst, kannst du auch als sogenannte smarte Sammlung anlegen: Dazu triffst du eine Auswahl an Tags, die Bilder in dieser Sammlung enthalten sollen. picsome befüllt diese Sammlung dann automatisch mit Bildern, die mit deinen vordefinierten Tags versehen sind. Das manuelle Hinzufügen von Tags/Bildern entfällt somit, vorausgesetzt du wählst diese Funktion aus. </p>" />
        </>
      ),
    },
    {
      headline: <T _str="Multi-Import" />,
      content: (
        <>
          <T _str=" {image} " image={<Image src={multiImport} alt="Onboarding Multi-Import" />} />
          <UT _str="<p>Diese Funktion ist vorerst nur für Bilder von Wikimedia Commons verfügbar. Du kannst damit mehrere Wikimedia Commons Bilder auf einmal in eine Sammlung importieren und musst nicht jedes Bild einzeln bei picsome indexieren. Das bietet sich vor allem an, weil es bei Wikimedia Commons viele Seiten gibt, die mehrere Bilder auf einmal versammeln (z. B. <a href='https://commons.wikimedia.org/wiki/Commons:Featured_pictures/de' target='_blank'>featured pictures</a>).</p>" />
        </>
      ),
    },
    {
      headline: <T _str="Du hast es geschafft!" />,
      content: (
        <>
          <UT _str="<p>Wir hoffen, dass dir die Tour gefallen hat und du picsome direkt testen möchtest. Falls du die Onboarding Tour zu einem späteren Zeitpunkt noch einmal ansehen willst, findest du sie unter “Häufige Fragen” in der Seitennavigation. Wir wünschen dir viel Spaß mit picsome!</p>" />
          <div className={styles.onboarding__done}>
            <Button as="tertiary" onClick={onFinish}>
              <T _str="Zu meinem Profil" />
            </Button>
          </div>
          <Image src={finish} alt="Onboarding Completed!" width="300" height="300" />
        </>
      ),
    },
  ]

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

  const [visibleStep, setVisibleStep] = useState(0)

  const isFinalSlide = visibleStep === onboardingSlides.length - 1

  return (
    <div className={styles.onboarding}>
      <div className={styles.onboarding__inner}>
        <Grid>
          <div className={styles.onboarding__header}>
            <Button
              onClick={() => {
                onClose()
              }}
            >
              <Close color="#fff" />
            </Button>
          </div>
        </Grid>
        <Grid>
          <div className={styles.onboarding__content}>
            {onboardingSlides.map((slide, i) => {
              return (
                <div
                  key={i}
                  className={classNames(styles.onboarding__slide, {
                    [styles.onboarding__slideActive as string]: i === visibleStep,
                  })}
                >
                  <h2 className={styles.onboarding__slideHeadline}>{slide.headline}</h2>
                  <div className={styles.onboarding__slideContent}>{slide.content}</div>
                </div>
              )
            })}
          </div>
        </Grid>
        <Grid>
          <div className={classNames(styles.onboarding__footer)}>
            <Button
              as="tertiary"
              active={visibleStep > 0}
              onClick={() => setVisibleStep(visibleStep - 1)}
            >
              <T _str="Zurück" />
            </Button>

            {!isFinalSlide && (
              <>
                <ul className={styles.onboarding__bullets}>
                  {onboardingSlides.map((slide, i) => {
                    return (
                      <li
                        key={i}
                        className={classNames(styles.onboarding__bullet, {
                          [styles.onboarding__bulletActive as string]: i === visibleStep,
                        })}
                        onClick={() => setVisibleStep(i)}
                      ></li>
                    )
                  })}
                </ul>

                <Button
                  as="tertiary"
                  onClick={() => setVisibleStep(visibleStep + 1)}
                  active={visibleStep < onboardingSlides.length - 1}
                >
                  <T _str="Weiter" />
                </Button>
              </>
            )}
          </div>
        </Grid>
      </div>
    </div>
  )
}

export default Onboarding
