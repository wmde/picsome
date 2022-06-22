import {
  BlitzPage,
  InferGetServerSidePropsType,
  invokeWithMiddleware,
  Routes,
  useRouter,
} from "blitz"
import CollectionPreview from "app/core/components/CollectionPreview"
import FeatureModule from "app/core/components/FeatureModule"
import InputStageModule from "app/core/components/InputStageModule"
import Layout from "../../core/layouts/Layout"
import getCollection from "app/collections/queries/getCollection"
import { T, useT } from "@transifex/react"
import { WikiCommons } from "app/core/components/RepositoryLogos"

type ServerSideProps = InferGetServerSidePropsType<typeof getServerSideProps>

const MultiImportPage: BlitzPage<ServerSideProps> = (props: ServerSideProps) => {
  const router = useRouter()
  const showError = router.query.showError === "true" ? true : false
  const errorText = useT(
    "Wie schade, dieses Bild können wir leider nicht untersuchen! Vermutlich stammt es von einer Bildersammlung, die picsome derzeit nicht unterstützt."
  )

  return (
    <>
      <InputStageModule
        theme="import"
        headline={<T _str="Multi-Import" />}
        copy={
          <T _str="Kopiere eine Galerie-URL von Wikimedia Commons und importiere mehrere Bilder gleichzeitig in eine Sammlung." />
        }
        error={showError ? errorText : undefined}
        logos={[{ el: <WikiCommons />, url: "https://commons.wikimedia.org/" }]}
        submitLabel={useT("Bilder auswählen")}
        onSubmit={(url) => router.push(Routes.MultiImportUrlPage({ url }))}
      >
        {props.featuredCollection && <CollectionPreview collection={props.featuredCollection} />}
      </InputStageModule>
      <FeatureModule
        theme="import"
        features={[
          {
            headline: <T _str="Galerie-URL eingeben" />,
            subline: <T _str="Kopiere die Galerie-URL in die Suchleiste." />,
          },
          {
            headline: <T _str="Bilder auswählen" />,
            subline: <T _str="Wähle die Bilder aus, die du gerne importieren möchtest." />,
          },
          {
            headline: <T _str="Zu Sammlung hinzufügen" />,
            subline: <T _str="Füge alle importierten Bilder einer Sammlung hinzu." />,
          },
        ]}
      />
    </>
  )
}

export const getServerSideProps = async (ctx) => {
  const featuredCollectionId = 1
  const featuredCollection = await invokeWithMiddleware(
    getCollection,
    { id: featuredCollectionId },
    ctx
  )
  return { props: { featuredCollection } }
}

MultiImportPage.authenticate = { redirectTo: Routes.LoginPage() }
MultiImportPage.suppressFirstRenderFlicker = true
MultiImportPage.getLayout = (page) => <Layout title="Multi-Import">{page}</Layout>

export default MultiImportPage
