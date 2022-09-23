import {
  BlitzPage,
  Image,
  useMutation,
  GetServerSideProps,
  invokeWithMiddleware,
  Routes,
  Link,
  getSession,
  useRouter,
} from "blitz"
import Button from "app/core/components/Button"
import CollectionModal from "app/core/components/CollectionModal"
import CollectionPreview from "app/core/components/CollectionPreview"
import Grid from "app/core/components/Grid"
import Layout from "app/core/layouts/Layout"
import Onboarding from "app/core/components/Onboarding"
import OnboardingMutation from "app/users/mutations/onboarding"
import ResourcePreview from "app/core/components/ResourcePreview"
import emptyImage from "../../../public/empty-account.png"
import getResourcesTaggedByUser from "app/resources/queries/getResourcesTaggedByUser"
import getUserJoinedCollections from "app/collections/queries/getUserJoinedCollections"
import getUserOwnedCollections from "app/collections/queries/getUserOwnedCollections"
import getUserSmartCollections from "app/collections/queries/getUserSmartCollections"
import logout from "app/auth/mutations/logout"
import styles from "./account.module.scss"
import { AddIcon, OtherCollectionIconBig, SmartCollectionIcon } from "app/core/components/Icons"
import { Close } from "app/core/components/Icons"
import { CollectionType } from "@prisma/client"
import { T } from "@transifex/react"
import { useState } from "react"

export const UserCollections = (props: { headline: string; collections: any[] }) => {
  const { headline, collections } = props

  return (
    <>
      <Grid modifier="gap">
        <h2 className={styles.headline}>{headline}</h2>
      </Grid>
      <Grid modifier="collections">
        {collections.map((collection, index) => (
          <CollectionPreview key={index} collection={collection} />
        ))}
      </Grid>
    </>
  )
}

export const UserResources = (props: { resources: any }) => {
  const { resources } = props

  if (resources.length > 0) {
    return (
      <div className={styles.section}>
        <Grid modifier="gap">
          <h2 className={styles.headline}>
            <T _str="Getaggte Bilder" />
          </h2>
        </Grid>
        <Grid>
          <div className={styles.resources}>
            {resources.map((resource, i) => {
              return <ResourcePreview key={i} resource={resource} />
            })}
          </div>
        </Grid>
      </div>
    )
  } else {
    return <EmptyResources />
  }
}

type EmptyCollectionsProps = {}

export const EmptyCollections = (props: EmptyCollectionsProps) => {
  return (
    <>
      <div className={styles.empty__container}>
        <h2 className={styles.empty__headline}>
          <T _str="Huch, hier ist noch alles leer!" />
        </h2>
        <p className={styles.empty__intro}>
          <T _str="Um eine Sammlung anzulegen, musst du erstmal ein Bild finden. Du kannst Bilder über die Bildersuche finden oder sie mit Hilfe des Lizenzcheckers hinzufügen." />
        </p>
        <Image className={styles.empty__image} src={emptyImage} alt="empty account" />
      </div>
    </>
  )
}

type OnBoardingTileProps = {
  toggle: (state: boolean) => void
  showOnboarding: (state: boolean) => void
}

export const OnBoardingTile = (props: OnBoardingTileProps) => {
  const { toggle, showOnboarding } = props

  const [setOnboardingAsFinished] = useMutation(OnboardingMutation)

  return (
    <div className={styles.onboarding}>
      <div className={styles.onboarding__inner}>
        <h3>
          <T _str="Onboarding Tour" />
        </h3>
        <Close
          className={styles.onboarding__close}
          onClick={async () => {
            await setOnboardingAsFinished()
            toggle(false)
          }}
        />
        <p>
          <T _str="Neu hier? Unsere kurze Onboarding Tour zeigt dir, was dich bei picsome alles erwartet. Du kannst die Tour jederzeit abbrechen und zu einem späteren Zeitpunkt wieder neu starten. " />
        </p>
        <Button
          as="primary"
          onClick={() => {
            showOnboarding(true)
          }}
        >
          <T _str="Tour starten" />
        </Button>
      </div>
    </div>
  )
}

export const EmptyResources = () => {
  return (
    <Grid>
      <div className={styles.empty__container}>
        <h2 className={styles.empty__headline}>
          <T _str="Du hast noch keine Tags zu Bildern hinzugefügt" />
        </h2>
        <p className={styles.empty__intro}>
          <T _str="Beschreibe Bilder mit Tags, um die Suche für alle zu verbessern." />
        </p>
      </div>
    </Grid>
  )
}

export type UserHomeProps = {
  ownedCollections: Awaited<ReturnType<typeof getUserOwnedCollections>>
  smartCollections: Awaited<ReturnType<typeof getUserSmartCollections>>
  joinedCollections: Awaited<ReturnType<typeof getUserJoinedCollections>>
  resources: Awaited<ReturnType<typeof getResourcesTaggedByUser>>
  onboarding: any
  isAdmin: boolean
}

export const getServerSideProps: GetServerSideProps<UserHomeProps> = async (ctx) => {
  const session = await getSession(ctx.req, ctx.res)

  // TODO: Setting `UserHome.authenticate = { redirectTo: Routes.LoginPage() }`
  // does not seem to have an effect on wether `getServerSideProps` is called
  // leading to an `AuthenticationError` error. See TODO at the end of the file.
  if (session.userId === null) {
    return {
      redirect: {
        destination: Routes.LoginPage().pathname,
        permanent: false,
      },
    }
  }

  const ownedCollections = await invokeWithMiddleware(getUserOwnedCollections, {}, ctx)
  const smartCollections = await invokeWithMiddleware(getUserSmartCollections, {}, ctx)
  const joinedCollections = await invokeWithMiddleware(getUserJoinedCollections, {}, ctx)
  const resources = await invokeWithMiddleware(getResourcesTaggedByUser, {}, ctx)

  const isAdmin = session.$isAuthorized("ADMIN")

  return {
    props: {
      ownedCollections,
      smartCollections,
      joinedCollections,
      resources,
      onboarding: session.hasFinishedOnboarding,
      isAdmin,
    },
  }
}

const UserHome: BlitzPage<UserHomeProps> = (props: UserHomeProps) => {
  const { ownedCollections, smartCollections, joinedCollections, resources, onboarding } = props

  const [createType, setCreateType] = useState<CollectionType | null>(null)

  const router = useRouter()

  const isEmpty =
    ownedCollections.count === 0 &&
    joinedCollections.count === 0 &&
    smartCollections.count === 0 &&
    resources.count === 0

  const [logoutMutation] = useMutation(logout)
  const [setOnboardingAsFinished] = useMutation(OnboardingMutation)

  const [showOnboardingTile, setShowOnboardingTile] = useState(!onboarding)
  const [showOnboarding, setShowOnboarding] = useState(
    router.query.onboarding === "1" ? true : false
  )

  return (
    <>
      <Grid>
        <div className={styles.header}>
          {props.isAdmin && (
            <Link href={Routes.AdminPage()}>
              <a className={styles.button}>
                <T _str="Verwaltungskonsole" />
              </a>
            </Link>
          )}
          <Link href={Routes.UserSettingsPage()}>
            <a className={styles.button}>
              <T _str="Kontoeinstellungen" />
            </a>
          </Link>
          <button
            className={styles.button}
            onClick={async () => {
              await logoutMutation()
            }}
          >
            <T _str="Logout" />
          </button>
        </div>
      </Grid>

      <Grid>
        {isEmpty && <EmptyCollections />}
        {showOnboardingTile && (
          <OnBoardingTile toggle={setShowOnboardingTile} showOnboarding={setShowOnboarding} />
        )}
      </Grid>

      {showOnboarding && (
        <Onboarding
          onClose={() => {
            router.replace(Routes.UserHome(), undefined, { shallow: true })
            setShowOnboarding(false)
          }}
          onFinish={async () => {
            router.replace(Routes.UserHome(), undefined, { shallow: true })
            await setOnboardingAsFinished()
            setShowOnboarding(false)
          }}
        />
      )}

      <div className={styles.section}>
        <Grid modifier="gap">
          <h2 className={styles.headline}>
            <T _str="Von mir erstellt" />
          </h2>
        </Grid>
        {ownedCollections.count === 0 && (
          <Grid>
            <p className={styles.notification}>
              <T _str="Hier erscheinen alle Sammlungen, die von dir erstellt wurden." />
            </p>
          </Grid>
        )}

        <Grid modifier="collections">
          <button
            className={styles["placeholder"]}
            onClick={(event) => setCreateType(CollectionType.PrivateCollection)}
          >
            <span className={styles["placeholder__inner"]}>
              <AddIcon />
              <T _str="Persönliche Sammlung erstellen" />
            </span>
          </button>
          {ownedCollections.count > 0 &&
            ownedCollections.items.map((collection, index) => {
              return <CollectionPreview key={index} collection={collection} isOwner={true} />
            })}
        </Grid>
      </div>

      <div className={styles.section}>
        <Grid modifier="gap">
          <h2 className={styles.headline}>
            <SmartCollectionIcon />
            <T _str="Smarte Sammlungen" />
          </h2>
        </Grid>
        {smartCollections.count === 0 && (
          <Grid>
            <p className={styles.notification}>
              <T _str="Hier erscheinen Sammlungen, die von picsome automatisch mit Bildern befüllt werden, die deine vordefinierten Tags enthalten." />
            </p>
          </Grid>
        )}
        <Grid modifier="collections">
          <button
            className={styles["placeholder"]}
            onClick={(event) => setCreateType(CollectionType.SmartCollection)}
          >
            <span className={styles["placeholder__inner"]}>
              <AddIcon />
              <T _str="Smarte Sammlung erstellen" />
            </span>
          </button>
          {smartCollections.items.map((collection, index) => (
            <CollectionPreview key={index} collection={collection} />
          ))}
        </Grid>
      </div>

      <div className={styles.section}>
        <Grid modifier="gap">
          <h2 className={styles.headline}>
            <OtherCollectionIconBig />
            <T _str="Von anderen geteilt" />
          </h2>
        </Grid>
        {joinedCollections.count === 0 && (
          <Grid>
            <p className={styles.notification}>
              <T _str="Hier erscheinen Sammlungen, an denen du mitsammelst!" />
            </p>
          </Grid>
        )}
        {joinedCollections.count > 0 && (
          <Grid modifier="collections">
            {joinedCollections.items.map((collection, index) => (
              <CollectionPreview key={index} collection={collection} />
            ))}
          </Grid>
        )}
      </div>

      <div className={styles.section}>
        <UserResources resources={resources.items} />
      </div>

      {createType !== null && (
        <CollectionModal initialType={createType} onClose={(event) => setCreateType(null)} />
      )}
    </>
  )
}

// TODO: Guests are not redirected despite this line. A manual redirection was
// added in `getServerSideProps`. This needs further investigation.
UserHome.authenticate = { redirectTo: Routes.LoginPage() }

UserHome.suppressFirstRenderFlicker = true
UserHome.getLayout = (page) => <Layout>{page}</Layout>

export default UserHome
