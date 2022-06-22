import { BlitzPage, Routes, invokeWithMiddleware, getSession, GetServerSideProps } from "blitz"
import styles from "./Home.module.scss"
import Layout from "app/core/layouts/Layout"
import Grid from "app/core/components/Grid"
import { HeroHome } from "app/core/components/HeroHome"
import { ImageText } from "app/core/components/ImageText"
import Row from "app/core/components/Row"
import CollectionPreview from "app/core/components/CollectionPreview"
import { T, useT } from "@transifex/react"
import { TextModule } from "app/core/components/TextModule"
import getResource from "app/resources/queries/getResource"
import Button from "app/core/components/Button"
import getCollection from "app/collections/queries/getCollection"
import getCollections from "app/collections/queries/getCollections"

export type HomeProps = {
  collections: any
  heroImage: any
  highlightCollection: any
  sectionTwoImage: any
  sectionThreeImage: any
  loggedIn: boolean
}

const Home: BlitzPage<HomeProps> = (props: HomeProps) => {
  const {
    collections,
    heroImage,
    highlightCollection,
    sectionThreeImage,
    sectionTwoImage,
    loggedIn = false,
  } = props

  const imageTextOne = {
    background: "#C2E1FF",
    headline: useT("Bilder finden, sammeln und teilen"),
    content: useT(
      "Im Netz gibt es Millionen von Bildern. Hier kannst du deine Lieblingsbilder finden, in Sammlungen organisieren und mit anderen teilen."
    ),
    ctatext: useT("Sammlungen entdecken"),
    ctaurl: Routes.CollectionsPage(),
  }

  const imageTextTwo = {
    background: "#EEEAFF",
    headline: useT("Bilder einfach verwenden"),
    image: sectionTwoImage,
    content: useT(
      "Im Netz gefundene Bilder korrekt zu verwenden, ist nicht trivial. Der Lizenzchecker hilft dir weiter."
    ),
    ctatext: useT("Zum Lizenzchecker"),
    ctaurl: Routes.Check(),
  }

  const imageTextThree = {
    background: "#C2D1F0",
    headline: useT("Bildersuche verbessern"),
    content: useT(
      "Das richtige Bild zu finden, kann eine echte Herausforderung sein. Mit passenden Tags kannst du dabei helfen, die Suche für alle zu verbessern."
    ),
    image: sectionThreeImage,
    ctatext: useT("Bilder ansehen"),
    ctaurl: Routes.ResourcesTagFreePage(),
  }

  const TextModuleContent = {
    headline: useT("Was sind “Freie Lizenzen”?"),
    content: useT(
      "Freie Lizenzen erlauben eine unkomplizierte Nachnutzung ohne viel Nachfragen –  <mark class='highlight'>solange die jeweiligen Lizenzbedingungen eingehalten werden.</mark>"
    ),
    ctaurl: Routes.AboutLicenses().pathname,
    ctatext: useT("Erfahre mehr"),
  }

  return (
    <>
      <HeroHome heroImage={heroImage} loggedIn={loggedIn} />

      <div className={styles.section}>
        {highlightCollection && <ImageText collection={highlightCollection} {...imageTextOne} />}
        <ImageText reverse={true} {...imageTextTwo} />
        <ImageText {...imageTextThree} />
      </div>

      <div className={styles.section}>
        <TextModule {...TextModuleContent} />
      </div>

      {collections && (
        <div className={styles.section}>
          <Grid>
            <Row>
              <h2 className={styles.headline}>
                <T _str="Ausgewählte Sammlungen" />
              </h2>
            </Row>
          </Grid>

          <Grid modifier="collections">
            {collections.map((collection, index) => (
              <CollectionPreview key={index} collection={collection} />
            ))}
          </Grid>
          <Grid>
            <Row>
              <div className={styles.more}>
                <Button href={Routes.CollectionsPage()} as="primary">
                  <T _str="Sammlungen entdecken" />
                </Button>
              </div>
            </Row>
          </Grid>
        </div>
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req, res } = ctx

  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=3600")

  const selectedCollectionIds = [1, 7, 8]

  // readd date as soon as we have seeding
  // const date = new Date()
  // const heroImageId = date.getDay() % 10

  const heroImageId = 10
  const highlightCollectionId = 1

  const sectionTwoImageId = 8
  const sectionThreeImageId = 9

  const resolvablePromises = [
    getSession(req, res),
    invokeWithMiddleware(getResource, { id: sectionTwoImageId }, ctx),
    invokeWithMiddleware(getResource, { id: sectionThreeImageId }, ctx),
    invokeWithMiddleware(getResource, { id: heroImageId }, ctx),
    invokeWithMiddleware(
      getCollections,
      {
        where: { id: { in: selectedCollectionIds } },
        take: selectedCollectionIds.length,
      },
      ctx
    ),
    invokeWithMiddleware(getCollection, { id: highlightCollectionId }, ctx),
  ] as const

  const [
    session,
    sectionTwoImage,
    sectionThreeImage,
    heroImage,
    selectedPaginatedCollections,
    highlightCollection,
  ] = await Promise.all(resolvablePromises)

  // const collections = undefined
  const collections = selectedPaginatedCollections?.items

  return {
    props: {
      heroImage,
      sectionTwoImage,
      sectionThreeImage,
      highlightCollection,
      collections,
      loggedIn: session.userId ? true : false,
    },
  }
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
