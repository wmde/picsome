import CollectionModal from "app/core/components/CollectionModal"
import CollectionPreview from "app/core/components/CollectionPreview"
import Error from "app/core/components/Error"
import Grid from "app/core/components/Grid"
import { RemoteImage } from "app/core/components/RemoteImage"
import Layout from "../../core/layouts/Layout"
import Loader from "app/core/components/Loader"
import classNames from "classnames"
import createResourcePreviewsForUrl from "app/check/mutations/createResourcePreviewsForUrl"
import getUserJoinedCollections from "app/collections/queries/getUserJoinedCollections"
import getUserOwnedCollections from "app/collections/queries/getUserOwnedCollections"
import importResources from "app/check/mutations/importResources"
import styles from "./[url].module.scss"
import {
  AddIcon,
  ArrowRight,
  OtherCollectionIcon,
  SuccessIcon,
  UserGroupIcon,
} from "app/core/components/Icons"
import { CollectionType } from "db"
import { CollectionWithResources } from "app/collections/queries/getCollection"
import { Image, InferGetServerSidePropsType, Routes, useMutation, useQuery, useRouter } from "blitz"
import { Resource } from "db"
import { ResourcePreview } from "integrations/license-check/types"
import { Suspense, useEffect, useState } from "react"
import { T } from "@transifex/react"
import { isUrl } from "integrations/license-check/libs/utils"

type ServerSideProps = InferGetServerSidePropsType<typeof getServerSideProps>

enum MultiImportStep {
  ResourcesPending = "resources-pending",
  SelectResources = "select-resources",
  SelectCollection = "select-collection",
  ImportPending = "import-pending",
  ImportComplete = "import-complete",
}

const MultiImportUrlPage = (props: ServerSideProps) => {
  const { url } = props
  const router = useRouter()

  // State
  const [resourcePreviews, setResourcePreviews] = useState<ResourcePreview[] | undefined>(undefined)
  const [step, setStep] = useState(MultiImportStep.ResourcesPending)
  const [selectedResourceUrls, setSelectedResourceUrls] = useState<string[]>([])
  const [selectedCollection, setSelectedCollection] = useState<CollectionWithResources | undefined>(
    undefined
  )
  const [importedResources, setImportedResources] = useState<Resource[] | undefined>(undefined)

  // Mutation handlers
  const onResourcePreviewsError = () => {
    router.push(Routes.MultiImportPage({ showError: true }))
  }
  const onResourcePreviewsSuccess = (resourcePreviews: ResourcePreview[]) => {
    if (resourcePreviews.length === 0) {
      onResourcePreviewsError()
      return
    }
    setResourcePreviews(resourcePreviews)
    setStep(MultiImportStep.SelectResources)
  }

  const onImportError = () => {
    // Go back one step to allow to retry the action
    setStep(MultiImportStep.SelectCollection)
    setImportedResources(undefined)
  }
  const onImportSuccess = (resources: Resource[]) => {
    if (!resources || resources.length === 0) {
      setStep(MultiImportStep.SelectResources)
      setImportedResources([])
    } else {
      setStep(MultiImportStep.ImportComplete)
      setImportedResources(resources)
    }
  }

  // Mutations
  const [createResourcePreviewsMutation] = useMutation(createResourcePreviewsForUrl, {
    onSuccess: onResourcePreviewsSuccess,
    onError: onResourcePreviewsError,
  })
  const [importMutation] = useMutation(importResources, {
    onSuccess: onImportSuccess,
    onError: onImportError,
  })

  // Effect used to trigger step mutations
  useEffect(() => {
    if (step === MultiImportStep.ResourcesPending) {
      createResourcePreviewsMutation({ url })
    } else if (step === MultiImportStep.ImportPending) {
      if (selectedResourceUrls.length > 0 && selectedCollection !== undefined) {
        importMutation({
          resourceUrls: selectedResourceUrls,
          collectionId: selectedCollection.id,
        })
      } else {
        onImportError()
      }
    }
  }, [
    createResourcePreviewsMutation,
    importMutation,
    url,
    step,
    selectedResourceUrls,
    selectedCollection,
  ])

  return (
    <section
      className={classNames(styles["multi-import"], {
        [styles["multi-import--" + step] as string]: true,
      })}
    >
      <Grid>
        <div className={styles["multi-import__inner"]}>
          {step !== MultiImportStep.ImportComplete && (
            <header className={styles["multi-import__header"]}>
              <h1 className={styles["multi-import__header-headline"]}>
                <T _str="Multi-Import" />
              </h1>
              {resourcePreviews !== undefined && (
                <span className={styles["multi-import__header-detail"]}>
                  {selectedResourceUrls.length === 0 && <T _str="Noch kein Bild ausgewählt" />}
                  {selectedResourceUrls.length === 1 && <T _str="Ein Bild ausgewählt" />}
                  {selectedResourceUrls.length > 1 && (
                    <T _str="{n} Bilder ausgewählt" n={selectedResourceUrls.length} />
                  )}
                </span>
              )}
            </header>
          )}

          {step === MultiImportStep.ResourcesPending && (
            <div className={styles["multi-import__step"]}>
              <h2 className={styles["multi-import__step-headline"]}>
                <T _str="Wir sammeln gerade Bilder für dich ein…" />
              </h2>
              <span className={styles["multi-import__copy"]}>{decodeURIComponent(url)}</span>
              <div className={styles["multi-import__spinner"]}>
                <Loader />
              </div>
            </div>
          )}

          {step === MultiImportStep.SelectResources && (
            <div className={styles["multi-import__step"]}>
              <h2 className={styles["multi-import__step-headline"]}>
                <T _str="Welche Bilder möchtest du importieren?" />
              </h2>
              {importedResources?.length === 0 && (
                <div className={styles["multi-import__step-error"]}>
                  <Error text="Aufgrund fehlender Lizenzinformationen konnten wir leider keines der ausgewählten Bilder importieren." />
                </div>
              )}
              <div className={styles["multi-import__resources"]}>
                {resourcePreviews &&
                  resourcePreviews.map((preview, index) => (
                    <button
                      key={index}
                      className={classNames(styles["multi-import__resource"], {
                        [styles["multi-import__resource--selected"] as string]:
                          selectedResourceUrls.includes(preview.resourceUrl),
                      })}
                      onClick={(event) =>
                        setSelectedResourceUrls(
                          selectedResourceUrls.includes(preview.resourceUrl)
                            ? selectedResourceUrls.filter((url) => preview.resourceUrl !== url)
                            : selectedResourceUrls.concat([preview.resourceUrl])
                        )
                      }
                    >
                      <div className={styles["multi-import__resource-image"]}>
                        {/* <Image
                          src={preview.imageUrl}
                          alt={preview.title}
                          layout="fill"
                          objectFit="cover"
                          sizes="320px"
                        /> */}
                        <RemoteImage src={preview.imageUrl} title={preview.title} />
                      </div>
                      <div className={styles["multi-import__resource-overlay"]}>
                        <div className={styles["multi-import__resource-overlay-icon"]}>
                          <SuccessIcon />
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
              <footer className={styles["multi-import__footer"]}>
                <button
                  className={styles["multi-import__btn-continue"]}
                  onClick={() => setStep(MultiImportStep.SelectCollection)}
                  disabled={selectedResourceUrls.length === 0}
                >
                  <T _str="Auswahl bestätigen" />
                </button>
              </footer>
            </div>
          )}

          {step === MultiImportStep.SelectCollection && (
            <div className={styles["multi-import__step"]}>
              <h2 className={styles["multi-import__step-headline"]}>
                <T _str="Zu welcher Sammlung möchtest du die Bilder hinzufügen?" />
              </h2>
              <Suspense fallback={<Loader />}>
                <CollectionPicker
                  selectedCollection={selectedCollection}
                  setSelectedCollection={setSelectedCollection}
                />
              </Suspense>
              <footer className={styles["multi-import__footer"]}>
                <button
                  className={styles["multi-import__btn-back"]}
                  onClick={() => setStep(MultiImportStep.SelectResources)}
                >
                  <T _str="Zurück" />
                </button>
                <button
                  className={styles["multi-import__btn-continue"]}
                  onClick={() => setStep(MultiImportStep.ImportPending)}
                  disabled={selectedCollection === undefined}
                >
                  <T _str="Import abschließen" />
                </button>
              </footer>
            </div>
          )}

          {step === MultiImportStep.ImportPending && (
            <div className={styles["multi-import__step"]}>
              <h2 className={styles["multi-import__step-headline"]}>
                <T
                  _str="Wir importieren {n} Bilder in die Sammlung “{collectionTitle}”…"
                  n={selectedResourceUrls.length}
                  collectionTitle={selectedCollection?.title ?? ""}
                />
              </h2>
              <div className={styles["multi-import__spinner"]}>
                <Loader />
              </div>
            </div>
          )}

          {step === MultiImportStep.ImportComplete && (
            <div className={styles["multi-import__complete"]}>
              <h1 className={styles["multi-import__complete-headline"]}>
                <T _str="Der Multi-Import war erfolgreich!" />
              </h1>
              <p className={styles["multi-import__complete-copy"]}>
                <T
                  _str="Für {importedCount} von {totalCount} Bilder lagen Lizenzinformationen vor und konnten erfolgreich in die Sammlung “{collectionTitle}” importiert werden."
                  totalCount={selectedResourceUrls.length}
                  importedCount={importedResources !== undefined ? importedResources.length : 0}
                  collectionTitle={selectedCollection?.title ?? ""}
                />
              </p>
              <button
                className={styles["multi-import__complete-action"]}
                onClick={(event) => {
                  if (selectedCollection !== undefined) {
                    router.push(Routes.CollectionPage({ collectionId: selectedCollection.id }))
                  }
                }}
              >
                <T _str="Zur Sammlung" />
                <ArrowRight />
              </button>
              <div className={styles["multi-import__complete-icon"]}>
                <SuccessIcon />
              </div>
            </div>
          )}
        </div>
      </Grid>
    </section>
  )
}

const CollectionPicker = (props: {
  selectedCollection: CollectionWithResources | undefined
  setSelectedCollection: (selectedCollection: CollectionWithResources | undefined) => void
}) => {
  const { selectedCollection, setSelectedCollection } = props
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [paginatedUserOwnedCollections, { refetch: refetchUserOwnedCollections }] = useQuery(
    getUserOwnedCollections,
    {}
  )
  const [paginatedUserJoinedCollections] = useQuery(getUserJoinedCollections, {})

  const onCollectionCreate = (collection) => {
    refetchUserOwnedCollections()
    setSelectedCollection(collection)
  }

  return (
    <>
      <button
        className={styles["multi-import__btn-create-collection"]}
        onClick={(event) => setShowCreateModal(true)}
      >
        <AddIcon />
        <T _str="Neue Sammlung erstellen" />
      </button>
      <div className={styles["multi-import__selection"]}>
        {paginatedUserOwnedCollections && (
          <div className={styles["multi-import__selection-section"]}>
            <h3 className={styles["multi-import__selection-headline"]}>
              <T _str="Von mir erstellt" />
            </h3>
            <div className={styles["multi-import__selection-collections"]}>
              {paginatedUserOwnedCollections.items.map((collection) => (
                <CollectionPreview
                  key={collection.id}
                  small
                  collection={collection}
                  selected={selectedCollection?.id === collection.id}
                  onSelectChange={(newSelected) =>
                    setSelectedCollection(newSelected ? collection : undefined)
                  }
                />
              ))}
            </div>
          </div>
        )}
        {paginatedUserJoinedCollections && (
          <div className={styles["multi-import__selection-section"]}>
            <h3 className={styles["multi-import__selection-headline"]}>
              <OtherCollectionIcon />
              <T _str="Von anderen geteilt" />
            </h3>
            <div className={styles["multi-import__selection-collections"]}>
              {paginatedUserJoinedCollections.items.map((collection) => (
                <CollectionPreview
                  key={collection.id}
                  small
                  collection={collection}
                  selected={selectedCollection?.id === collection.id}
                  onSelectChange={(newSelected) =>
                    setSelectedCollection(newSelected ? collection : undefined)
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>
      {showCreateModal && (
        <CollectionModal
          initialType={CollectionType.PrivateCollection}
          availableTypes={[CollectionType.PrivateCollection, CollectionType.JointCollection]}
          onCreate={onCollectionCreate}
          onClose={(event) => setShowCreateModal(false)}
        />
      )}
    </>
  )
}

export const getServerSideProps = ({ query }) => {
  const url = query.url
  if (!url || !isUrl(url)) {
    return {
      redirect: {
        destination: Routes.MultiImportPage(),
        permanent: false,
      },
    }
  }
  return { props: { url: url } }
}

MultiImportUrlPage.suppressFirstRenderFlicker = true
MultiImportUrlPage.getLayout = (page) => <Layout>{page}</Layout>

export default MultiImportUrlPage
