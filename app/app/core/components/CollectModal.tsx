import CollectionPreview from "./CollectionPreview"
import LabeledTextField from "./LabeledTextField"
import RadioField from "./RadioField"
import createCollection from "app/collections/mutations/createCollection"
import createCollectionItem from "app/collection-items/mutations/createCollectionItem"
import deleteCollectionItem from "app/collection-items/mutations/deleteCollectionItem"
import getMyCollectionItemsForResource from "app/collection-items/queries/getMyCollectionItemsForResource"
import getUserJoinedCollections from "app/collections/queries/getUserJoinedCollections"
import getUserOwnedCollections from "app/collections/queries/getUserOwnedCollections"
import styles from "./CollectModal.module.scss"
import { CollectionWithResources } from "app/collections/queries/getCollection"
import { Form } from "app/core/components/Form"
import { Modal } from "./Modal"
import { CheckCircle, OtherCollectionIcon, PlusIcon, UserGroupIcon } from "./Icons"
import { Resource } from "db"
import { ResourceImage } from "./ResourceImage"
import { SyntheticEvent, useCallback, useState } from "react"
import { T, useT } from "@transifex/react"
import { useMutation, useQuery } from "blitz"
import Check from "app/pages/check"

export const CollectModal = (props: {
  resource: Resource
  userId: number | null
  onClose: (event?: SyntheticEvent) => void
}) => {
  const { onClose, resource } = props

  const [collectionItems, { refetch: refetchCollectionItems }] = useQuery(
    getMyCollectionItemsForResource,
    { resourceId: resource.id }
  )
  const [
    paginatedUserOwnedCollections,
    { setQueryData: setUserOwnedCollectionsQueryData, refetch: refetchUserOwnedCollections },
  ] = useQuery(getUserOwnedCollections, {})
  const [paginatedUserJoinedCollections, { setQueryData: setUserJoinedCollectionsQueryData }] =
    useQuery(getUserJoinedCollections, {})

  const [showCreateCollection, setShowCreateCollection] = useState(false)
  const title = useT("Bild sammeln")

  const onCreate = useCallback(
    (collection: Awaited<ReturnType<typeof createCollection>>) => {
      setShowCreateCollection(false)
      refetchUserOwnedCollections({})
    },
    [setShowCreateCollection, refetchUserOwnedCollections]
  )

  const { id: resourceId } = resource
  if (resourceId === undefined) {
    return null
  }

  return (
    <Modal title={title} onClose={onClose}>
      <div className={styles.row}>
        <div className={styles.image}>
          <ResourceImage resource={resource} layout="fill" objectFit="cover" />
        </div>
        <div className={styles.imageAction}>
          {showCreateCollection ? (
            <CreateCollection onCreate={onCreate} resource={resource} />
          ) : (
            <button
              className={`button button--small ${styles.button}`}
              onClick={() => setShowCreateCollection(!showCreateCollection)}
            >
              <PlusIcon />{" "}
              <span>
                <T _str="Sammlung erstellen" />
              </span>
            </button>
          )}
        </div>
      </div>
      <div className={styles.selection}>
        <div className={styles.selectionHalf}>
          <h2 className={styles.selectionHeadline}>
            <T _str="Von mir erstellt" />
          </h2>
          <div className={styles.collections}>
            {paginatedUserOwnedCollections &&
              paginatedUserOwnedCollections.items.map((collection) => (
                <CollectionWidget
                  key={collection.id}
                  collection={collection}
                  resourceId={resourceId}
                  selected={
                    collectionItems.find((item) => item.collectionId === collection.id) !==
                    undefined
                  }
                  refetch={refetchCollectionItems}
                  setQueryData={setUserOwnedCollectionsQueryData}
                />
              ))}
          </div>
        </div>
        <div className={styles.selectionHalf}>
          <h2 className={styles.selectionHeadline}>
            <OtherCollectionIcon />
            <T _str="Von anderen geteilt" />
          </h2>
          <div className={styles.collections}>
            {paginatedUserJoinedCollections &&
              paginatedUserJoinedCollections.items.map((collection) => (
                <CollectionWidget
                  key={collection.id}
                  collection={collection}
                  resourceId={resourceId}
                  selected={
                    collectionItems.find((item) => item.collectionId === collection.id) !==
                    undefined
                  }
                  refetch={refetchCollectionItems}
                  setQueryData={setUserJoinedCollectionsQueryData}
                />
              ))}
          </div>
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.footer}>
          <button
            className={`button button--small button--secondary ${styles.button}`}
            onClick={() => onClose()}
          >
            <T _str="Fertig" />
          </button>
        </div>
      </div>
    </Modal>
  )
}

const CollectionWidget = (props: {
  collection: CollectionWithResources
  resourceId: number
  selected: boolean
  refetch: () => void
  setQueryData: (data: any) => void
  optimisticUpdate?: (id: number, items: { id: number }[]) => void
}) => {
  const { collection, resourceId, selected, refetch, setQueryData } = props
  const { id: collectionId } = collection
  const [createItemMutation] = useMutation(createCollectionItem)
  const [deleteItemMutation] = useMutation(deleteCollectionItem)

  return (
    <div className={styles.collectcontainer}>
      <CollectionPreview
        small
        collection={collection}
        selected={selected}
        onSelectChange={async (newSelected) => {
          if (selected !== newSelected) {
            try {
              if (selected) {
                await deleteItemMutation({
                  collectionId: collectionId,
                  resourceId,
                })
              } else {
                const userCollections = await createItemMutation({
                  collectionId,
                  resourceId,
                })
                setQueryData(userCollections)
              }
              refetch()
            } catch (error) {
              alert("Error saving project")
            }
          }
        }}
      />
    </div>
  )
}

const CreateCollection = (props: {
  resource: Resource
  onCreate: (collection: Awaited<ReturnType<typeof createCollection>>) => void
}) => {
  const { resource, onCreate } = props
  const [createCollectionMutation] = useMutation(createCollection)
  const collectionTypeOptions = [
    {
      value: "PrivateCollection",
      label: useT("Nur ich"),
      description: useT(
        "Nur du kannst die Sammlung bearbeiten (Sammlung erstellen, Sammlungstitel ausw??hlen und ??ndern, Bilder hinzuf??gen und l??schen, Sammlung l??schen)."
      ),
    },
    {
      value: "JointCollection",
      label: useT("Alle"),
      description: useT(
        "Auch andere Nutzer*innen k??nnen zu deiner Sammlung beitragen, indem sie Bilder hinzuf??gen und l??schen"
      ),
    },
  ]
  return (
    <Form
      className={styles.createForm}
      submitText="Sammlung erstellen"
      initialValues={{
        title: "",
        type: "PrivateCollection",
        //initialResourceId: resource.id,
      }}
      onSubmit={async (values) => {
        try {
          const collection = await createCollectionMutation(values)
          onCreate(collection)
        } catch (error) {
          alert("Error saving collection")
        }
      }}
    >
      <LabeledTextField
        className={styles.textfield}
        name="title"
        label="Titel der Sammlung"
        placeholder="Titel eingeben"
      />
      <div className={styles.collectionType}>
        <RadioField
          name="type"
          label={<T _str="Wer darf Bilder zur Sammlung hinzuf??gen?" />}
          options={collectionTypeOptions}
        />
      </div>
    </Form>
  )
}

export default CollectModal
