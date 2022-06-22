import { useState, useRef, useEffect } from "react"
import {
  Head,
  useRouter,
  BlitzPage,
  useMutation,
  getSession,
  GetServerSideProps,
  invokeWithMiddleware,
  Image,
} from "blitz"
import Layout from "app/core/layouts/Layout"
import getCollection from "app/collections/queries/getCollection"
import deleteCollection from "app/collections/mutations/deleteCollection"
import getUserById from "app/users/queries/getUserById"
import Grid from "app/core/components/Grid"
import { BackButton } from "app/core/components/BackButton"
import styles from "./collections.module.scss"
import { CheckCircle, EditPen } from "app/core/components/Icons"
import ResourcePreview from "app/core/components/ResourcePreview"
import { T, useT } from "@transifex/react"
import { ShareButton } from "app/core/components/ShareButton"
import updateCollection from "app/collections/mutations/updateCollection"
import deleteCollectionItem from "app/collection-items/mutations/deleteCollectionItem"
import joinCollection from "app/collections/mutations/joinCollection"
import getHasJoinedCollection from "app/collections/queries/getHasJoinedCollection"
import { Form, FormSpy } from "react-final-form"
import CollectionTypeIndicator from "app/core/components/CollectionTypeIndicator"
import RadioField from "app/core/components/RadioField"
import { PrivilegedActionModal } from "app/auth/components/PrivilegedActionModal"
import getCollectionResources from "app/resources/queries/getCollectionResources"
import { CollectionType } from "@prisma/client"
import CollectionModal from "app/core/components/CollectionModal"
import TagList from "app/core/components/TagList"
import emptyImage from "../../../public/empty-account.png"

export type CollectionProps = {
  collection: Awaited<ReturnType<typeof getCollection>>
  paginatedResources: Awaited<ReturnType<typeof getCollectionResources>>
  user: Awaited<ReturnType<typeof getUserById>>
  currentUser: any
  hasJoined: boolean
  shareUrl: string
}

export const Collection = (props: CollectionProps) => {
  const {
    user,
    currentUser,
    hasJoined: initialHasJoined,
    collection,
    paginatedResources,
    shareUrl,
  } = props
  const router = useRouter()

  const [deleteCollectionMutation] = useMutation(deleteCollection)
  const [deleteCollectionItemMutation] = useMutation(deleteCollectionItem)
  const [updateCollectionMutation] = useMutation(updateCollection)
  const [joinCollectionMutation] = useMutation(joinCollection)

  const [editable, setEditable] = useState(false)
  const [title, setTitle] = useState(collection.title)
  const [type, setType] = useState(collection.type)
  const [hasJoined, setHasJoined] = useState(initialHasJoined)
  const [showPrivilegedActionModal, setShowPrivilegedActionModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const titleInput = useRef<HTMLInputElement>(null)
  const isCreator = currentUser === user?.id

  const collectionTypeOptions = [
    {
      value: "PrivateCollection",
      label: useT("Persönliche Sammlung"),
      description: useT("Nur du kannst diese Sammlung Bearbeiten."),
    },
    {
      value: "JointCollection",
      label: useT("Gemeinsame Sammlung"),
      description: useT("Alle können Bilder zu dieser Sammlung hinzufügen oder entfernen."),
    },
  ]

  const onJoinToggleClick = () => {
    if (!currentUser) {
      setShowPrivilegedActionModal(true)
      return
    }

    // TODO: Implement loading indicator and check wether successful
    joinCollectionMutation({ collectionId: collection.id, join: !hasJoined })
    setHasJoined(!hasJoined)
  }

  const onEditTitleClick = () => {
    setEditable(true)
  }

  const onSaveTitleClick = () => {
    setEditable(false)
    updateCollectionMutation({ id: collection.id, title: title })
  }

  const onTypeChange = (newType) => {
    if (newType !== type) {
      setType(newType)
      updateCollectionMutation({ id: collection.id, type: newType })
    }
  }

  useEffect(() => {
    if (editable && titleInput.current) {
      titleInput.current && titleInput?.current?.focus()
    }
  }, [editable, titleInput])

  return (
    <>
      <Head>
        <title>picsome - {collection.title}</title>
      </Head>
      <Grid>
        <BackButton>
          <T _str="Zurück" />
        </BackButton>
      </Grid>

      {isCreator && collection.type !== CollectionType.SmartCollection && (
        <Grid modifier="gap">
          <div className={styles.typeControl}>
            <Form
              initialValues={{ type: collection.type }}
              onSubmit={(values) => {
                /* Changes are handled by FormSpy */
              }}
            >
              {(props) => (
                <form onSubmit={props.handleSubmit}>
                  <RadioField name="type" options={collectionTypeOptions} />
                  <FormSpy
                    subscription={{ values: true }}
                    onChange={(props) => onTypeChange(props.values.type)}
                  />
                </form>
              )}
            </Form>
          </div>
        </Grid>
      )}

      {(!isCreator || collection.type === CollectionType.SmartCollection) && (
        <Grid>
          <div className={styles.typeIndicator}>
            <CollectionTypeIndicator type={collection.type} isOwner={isCreator} />
          </div>
        </Grid>
      )}

      <Grid>
        <div className={styles.bar}>
          <div className={styles.barGroup}>
            <h1 className={styles.headline}>
              {/* {isCreator ? (
                <input
                  className={styles.title}
                  value={title}
                  ref={titleInput}
                  onChange={(event) => setTitle(event.target.value)}
                  readOnly={!editable}
                />
              ) : (
                collection.title
              )} */}
              {collection.title}
            </h1>
            {/* {isCreator && (
              <div className={styles.barGroup}>
                {!editable ? (
                  <EditPen onClick={onEditTitleClick} className={styles.edit} />
                ) : (
                  <CheckCircle onClick={onSaveTitleClick} className={styles.edit} />
                )}
              </div>
            )} */}
            {!isCreator && <span className={styles.author}>{user?.name}</span>}
          </div>
          <div className={styles.barGroup}>
            {isCreator && (
              <div className={styles.barButton}>
                <button className="button button--small" onClick={() => setShowEditModal(true)}>
                  <T _str="Sammlung bearbeiten" />
                </button>
                <button
                  className={styles.delete}
                  onClick={async () => {
                    await deleteCollectionMutation({ id: collection.id })
                    router.push("/my")
                  }}
                >
                  <T _str="Sammlung löschen" />
                </button>
              </div>
            )}
            {!isCreator && (
              <>
                <div className={styles.barButton}>
                  <ShareButton url={shareUrl}>
                    <T _str="Teilen" />
                  </ShareButton>
                </div>
                {collection.type === "JointCollection" && (
                  <div className={styles.barButton}>
                    {!hasJoined && (
                      <button className="button button--small" onClick={onJoinToggleClick}>
                        <T _str="Mitsammeln" />
                      </button>
                    )}
                    {hasJoined && (
                      <button className="button button--small" onClick={onJoinToggleClick}>
                        <T _str="Verlassen" />
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {collection.type === CollectionType.SmartCollection && (
          <div className={styles.tags}>
            <TagList items={collection.tags} />
          </div>
        )}
      </Grid>

      {showPrivilegedActionModal && (
        <PrivilegedActionModal onClose={() => setShowPrivilegedActionModal(false)} />
      )}

      {showEditModal && (
        <CollectionModal collection={collection} onClose={() => setShowEditModal(false)} />
      )}

      <div className={styles.collection}>
        <Grid modifier="gap">
          {paginatedResources.count > 0 &&
            paginatedResources.items.map((resource, index) => (
              <ResourcePreview
                key={index}
                resource={resource}
                editable={isCreator || collection.type === "JointCollection"}
                deleteFunc={async () => {
                  // TODO: Make sure not to offer deletion of smart collection items
                  await deleteCollectionItemMutation({
                    resourceId: resource.id,
                    collectionId: collection.id,
                  })
                  router.replace(router.asPath)
                }}
              />
            ))}
          {paginatedResources.count === 0 && (
            <div className={styles.emptyContainer}>
              <p className={styles.emptyCopy}>
                {collection.type === CollectionType.SmartCollection && (
                  <T _str="Bei Picsome wurden bisher keine Bilder mit passenden Tags indexiert." />
                )}
                {collection.type !== CollectionType.SmartCollection && (
                  <T _str="Diese Sammlung ist leer." />
                )}
              </p>
              <div className={styles.emptyImage}>
                <Image src={emptyImage} alt="" />
              </div>
            </div>
          )}
        </Grid>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<CollectionProps> = async (ctx) => {
  const { query, req, res, resolvedUrl } = ctx

  const session = await getSession(req, res)

  const rawCollectionId = query.collectionId
  if (!rawCollectionId) {
    return { notFound: true }
  }

  const collectionId = parseInt(rawCollectionId.toString())

  const collection = await invokeWithMiddleware(getCollection, { id: collectionId }, ctx)

  if (!collection) return { notFound: true }

  // TODO: Implement pagination in frontend
  const paginatedResources = await invokeWithMiddleware(
    getCollectionResources,
    { collectionId },
    ctx
  )

  const user = await invokeWithMiddleware(getUserById, { id: collection.userId }, ctx)
  const hasJoined = await invokeWithMiddleware(getHasJoinedCollection, { id: collectionId }, ctx)

  return {
    props: {
      collection,
      paginatedResources,
      user,
      currentUser: session.userId,
      hasJoined,
      shareUrl: "https://" + req.headers.host + resolvedUrl,
    },
  }
}

const CollectionPage: BlitzPage<CollectionProps> = (props: CollectionProps) => {
  return (
    <main className={styles.main}>
      <Collection {...props} />
    </main>
  )
}

CollectionPage.authenticate = false
CollectionPage.getLayout = (page) => <Layout>{page}</Layout>

export default CollectionPage
