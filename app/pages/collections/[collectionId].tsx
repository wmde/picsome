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
  NotFoundError,
  AuthorizationError,
} from "blitz"
import CollectionModal from "app/core/components/CollectionModal"
import CollectionTypeIndicator from "app/core/components/CollectionTypeIndicator"
import Grid from "app/core/components/Grid"
import Layout from "app/core/layouts/Layout"
import RadioField from "app/core/components/RadioField"
import ResourcePreview from "app/core/components/ResourcePreview"
import TagList from "app/core/components/TagList"
import deleteCollection from "app/collections/mutations/deleteCollection"
import deleteCollectionItem from "app/collection-items/mutations/deleteCollectionItem"
import emptyImage from "../../../public/empty-account.png"
import getCollection from "app/collections/queries/getCollection"
import getCollectionResources from "app/resources/queries/getCollectionResources"
import getHasJoinedCollection from "app/collections/queries/getHasJoinedCollection"
import getUserById from "app/users/queries/getUserById"
import joinCollection from "app/collections/mutations/joinCollection"
import styles from "./collections.module.scss"
import updateCollection from "app/collections/mutations/updateCollection"
import { BackButton } from "app/core/components/BackButton"
import { CollectionType, Report } from "db"
import { Form, FormSpy } from "react-final-form"
import { PrivilegedActionModal } from "app/auth/components/PrivilegedActionModal"
import { ShareButton } from "app/core/components/ShareButton"
import { T, useT } from "@transifex/react"
import getItemReports from "app/reports/queries/getItemReports"
import Row from "app/core/components/Row"
import ReportLog from "app/reports/components/ReportLog"
import Error from "app/core/components/Error"
import ReportButton from "app/reports/components/ReportButton"
import { hiddenItemReportStatuses } from "app/reports/shared"

export type CollectionProps = {
  collection: Awaited<ReturnType<typeof getCollection>>
  paginatedResources: Awaited<ReturnType<typeof getCollectionResources>>
  owner: Awaited<ReturnType<typeof getUserById>>
  userId: number | null
  isAdmin: boolean
  reports: Report[]
  isHidden: boolean
  isAuthorizedToRuleReports: boolean
  isFeaturedCollection: boolean
  hasJoined: boolean
  shareUrl: string
}

export const Collection = (props: CollectionProps) => {
  const {
    owner,
    userId,
    reports,
    isHidden,
    isAuthorizedToRuleReports,
    isFeaturedCollection,
    isAdmin,
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
  const isOwner = userId !== null && userId === owner?.id
  const canEdit = isAdmin || isOwner

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
    if (userId === null) {
      setShowPrivilegedActionModal(true)
      return
    }

    // TODO: Implement loading indicator and check wether successful
    joinCollectionMutation({ collectionId: collection.id, join: !hasJoined })
    setHasJoined(!hasJoined)
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
        <title>{`picsome - ${collection.title}`}</title>
      </Head>
      <Grid>
        <BackButton>
          <T _str="Zurück" />
        </BackButton>

        {isHidden && (
          <Row>
            <Error
              text={
                <T _str="Dieser Inhalt ist aufgrund einer offenen Meldung oder einer Entscheidung gesperrt." />
              }
            />
          </Row>
        )}
      </Grid>

      {canEdit && collection.type !== CollectionType.SmartCollection && (
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

      {(!canEdit || collection.type === CollectionType.SmartCollection) && (
        <Grid>
          <div className={styles.typeIndicator}>
            <CollectionTypeIndicator type={collection.type} isOwner={isOwner} />
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
            {!canEdit && <span className={styles.author}>{owner?.name}</span>}
          </div>
          <div className={styles.barGroup}>
            {canEdit && (
              <>
                <div className={styles.barButton}>
                  <button className="button button--small" onClick={() => setShowEditModal(true)}>
                    <T _str="Sammlung bearbeiten" />
                  </button>
                </div>
                <div className={styles.barButton}>
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
              </>
            )}
            {!canEdit && (
              <>
                {!isFeaturedCollection && (
                  <div className={styles.barButton}>
                    <ReportButton collectionId={collection.id} />
                  </div>
                )}
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
            <div className={styles.barButton}>
              <ShareButton url={shareUrl}>
                <T _str="Teilen" />
              </ShareButton>
            </div>
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
                editable={
                  (collection.type === "PrivateCollection" && isOwner) ||
                  collection.type === "JointCollection"
                }
                deleteFunc={async () => {
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

      {reports.length > 0 && (
        <div className={styles.reportsSection}>
          <Grid modifier="gap">
            <Row>
              <h2>
                <T _str="Meldungen zu diesem Inhalt" />
              </h2>
            </Row>
          </Grid>
          <Grid modifier="gap">
            <Row>
              <ReportLog reports={reports} showRulingForm={isAuthorizedToRuleReports} />
            </Row>
          </Grid>
        </div>
      )}
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

  let collection
  try {
    collection = await invokeWithMiddleware(
      getCollection,
      {
        id: collectionId,
        filterVisible: false,
      },
      ctx
    )
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { notFound: true }
    } else {
      throw error
    }
  }

  const reports = await invokeWithMiddleware(getItemReports, { collectionId }, { req, res })

  const isHidden =
    undefined !== reports.find((report) => hiddenItemReportStatuses.includes(report.status))
  const isAuthorizedToRuleReports = session.$isAuthorized(["ADMIN"])
  const isFeaturedCollection = collectionId === 1

  if (isHidden && !isAuthorizedToRuleReports) {
    throw new AuthorizationError("The requested content is currently unavailable.")
  }

  // TODO: Implement pagination in frontend
  const paginatedResources = await invokeWithMiddleware(
    getCollectionResources,
    { collectionId },
    ctx
  )

  const owner = await invokeWithMiddleware(getUserById, { id: collection.userId }, ctx)
  const hasJoined = await invokeWithMiddleware(getHasJoinedCollection, { id: collectionId }, ctx)

  return {
    props: {
      collection,
      paginatedResources,
      reports,
      isHidden,
      isAuthorizedToRuleReports,
      isFeaturedCollection,
      owner,
      userId: session.userId,
      isAdmin: session.$isAuthorized("ADMIN"),
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
