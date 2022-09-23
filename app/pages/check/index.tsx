import {
  BlitzPage,
  InferGetServerSidePropsType,
  invokeWithMiddleware,
  Routes,
  Router,
  useRouter,
} from "blitz"
import FeatureModule from "app/core/components/FeatureModule"
import InputStageModule from "app/core/components/InputStageModule"
import Layout from "../../core/layouts/Layout"
import getResource from "app/resources/queries/getResource"
import styles from "./check.module.scss"
import useAttribution from "app/licenses/hooks/useAttribution"
import { ResourceImage } from "app/core/components/ResourceImage"
import { T, UT, useT } from "@transifex/react"
import { Wikipedia, WikiCommons, Openverse } from "app/core/components/RepositoryLogos"

type ServerSideProps = InferGetServerSidePropsType<typeof getServerSideProps>

const Check: BlitzPage<ServerSideProps> = (props: ServerSideProps) => {
  const router = useRouter()
  const showError = router.query.showError === "true" ? true : false
  const errorText = useT(
    "Wie schade, dieses Bild können wir leider nicht untersuchen! Vermutlich stammt es von einer Bildersammlung, die picsome derzeit nicht unterstützt."
  )

  const attribution = useAttribution(props.image)

  const wikiCommonsURL = useT("https://commons.wikimedia.org/wiki/Main_Page?uselang=de")
  const wikipediaURL = useT("https://de.wikipedia.org/wiki/Wikipedia:Hauptseite")

  return (
    <>
      <InputStageModule
        theme="license"
        headline={<T _str="Lizenzchecker" />}
        copy={
          <>
            <p>
              <T _str="Füge eine Bild-URL von Wikimedia Commons oder Openverse ein, oder die URL eines Wikipedia-Artikels mit Bildern, und wir erstellen einen Lizenzhinweis für dich." />
            </p>
            <p>
              <UT
                _inline
                _str="<b>Tipp:</b> Die Bild-URL bei Wikimedia Commons beginnt mit <mark>https://commons.wikimedia.org/wiki/File</mark>. Bild-URLs von Openverse beginnen mit <mark>https://wordpress.org/openverse/image/</mark>. Für Bilder von Wikipedia gib die Artikel-URL ein, also z. B. <mark>https://de.wikipedia.org/wiki/Abbild</mark>. Befinden sich mehrere Bilder auf der Artikelseite, wird dir eine Auswahl angezeigt, und du kannst das Bild auswählen, für das du einen Lizenzhinweis generieren möchtest."
              />
            </p>
            <p>
              <T _str="Derzeit unterstützen wir diese Internetseiten:" />
            </p>
          </>
        }
        error={showError ? errorText : undefined}
        logos={[
          { el: <Wikipedia />, url: wikipediaURL },
          { el: <WikiCommons />, url: wikiCommonsURL },
          // { el: <Flickr />, url: "https://www.flickr.com/" },
          { el: <Openverse />, url: "https://search.openverse.engineering/" },
        ]}
        inputPlaceholder={useT("Lizenz checken")}
        submitLabel={useT("Bild URL eingeben")}
        onSubmit={(url) => router.push(Routes.CheckUrl({ url }))}
      >
        <div className={styles.image}>
          {props.image && <ResourceImage resource={props.image} sizes="640px" layout="intrinsic" />}
        </div>
        <div
          className={styles.attribution}
          dangerouslySetInnerHTML={{ __html: attribution.html }}
        ></div>
      </InputStageModule>
      <FeatureModule
        theme="license"
        features={[
          {
            headline: <T _str="Bild-URL eingeben" />,
            subline: (
              <T _str="Kopiere die Bild-URL auf der Webseite, von der das Bild stammt, und füge sie hier im Lizenzchecker ein." />
            ),
          },
          {
            headline: <T _str="Lizenzhinweis generieren" />,
            subline: (
              <T _str="Wir überprüfen das Bild, checken seine Verwendbarkeit, und erstellen den Lizenzhinweis." />
            ),
          },
          {
            headline: <T _str="Bild verwenden" />,
            subline: (
              <T _str="Füge den Lizenzhinweis in deine Veröffentlichung ein, um das Bild lizenzkonform zu nutzen." />
            ),
          },
        ]}
        actionLabel={<T _str="Beispielbild anzeigen" />}
        onActionClick={() => Router.push(Routes.ResourcePage({ resourceId: 1 }))}
      />
    </>
  )
}

export const getServerSideProps = async (ctx) => {
  const imageId = 1
  const image = await invokeWithMiddleware(getResource, { id: imageId }, ctx)

  return {
    props: {
      image,
    },
  }
}

Check.suppressFirstRenderFlicker = true
Check.getLayout = (page) => <Layout title="Lizenzchecker">{page}</Layout>

export default Check
