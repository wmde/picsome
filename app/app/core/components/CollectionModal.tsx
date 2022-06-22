import Autocomplete from "./Autocomplete"
import Form from "./Form"
import LabeledTextField from "./LabeledTextField"
import RadioField, { RadioFieldOptions } from "./RadioField"
import createCollection from "app/collections/mutations/createCollection"
import styles from "./CollectionModal.module.scss"
import { Collection, CollectionType } from "@prisma/client"
import { FormSpy } from "react-final-form"
import { Modal } from "./Modal"
import { Routes, useMutation, useRouter } from "blitz"
import { SyntheticEvent, useCallback, useState } from "react"
import { T, useT } from "@transifex/react"
import { WikidataItem } from "../services/wikidata"
import { CollectionWithResources } from "app/collections/queries/getCollection"
import updateCollection from "app/collections/mutations/updateCollection"

/**
 * Modal for creating and editing a collection.
 */
const CollectionModal = (props: {
  collection?: CollectionWithResources
  initialTitle?: string
  initialType?: CollectionType
  initialTags?: WikidataItem[]
  availableTypes?: CollectionType[]
  onCreate?: (collection: Collection) => void
  onUpdate?: (collection: Collection) => void
  onClose: (event?: SyntheticEvent) => void
}) => {
  const { collection, availableTypes, onClose, onCreate, onUpdate } = props

  const initialTitle =
    collection?.title ||
    props.initialTitle ||
    props.initialTags?.map((tag) => tag.label).join(" ") ||
    ""
  const initialType = collection?.type || props.initialType || CollectionType.PrivateCollection
  const initialTags = collection?.tags || props.initialTags || []

  const modalTitle = useT(collection !== undefined ? "Sammlung bearbeiten" : "Sammlung erstellen")
  const submitLabel = useT(collection !== undefined ? "Sammlung bearbeiten" : "Sammlung erstellen")
  const titleLabel = useT("Titel")
  const typeLabel = useT("Typ")

  const [createCollectionMutation] = useMutation(createCollection)
  const [updateCollectionMutation] = useMutation(updateCollection)

  const [tags, setTags] = useState<WikidataItem[]>(initialTags)
  const [tagsFieldVisible, setTagsFieldVisible] = useState(
    initialType === CollectionType.SmartCollection
  )

  const smartCollectionDescription = useT(
    "Du triffst eine Auswahl an Tags, die die Bilder in dieser Sammlung enthalten sollen. picsome befüllt diese Sammlung dann automatisch mit Bildern, die deine vordefinierten Tags enthalten."
  )
  const jointCollectionDescription = useT(
    "Auch andere Nutzer*innen können zu deiner Sammlung beitragen, indem sie Bilder hinzufügen und löschen."
  )
  const personalCollectionDescription = useT(
    "Nur du kannst die Sammlung bearbeiten (Sammlung erstellen, Sammlungstitel auswählen und ändern, Bilder hinzufügen und löschen, Sammlung löschen)"
  )

  const router = useRouter()

  const onSubmit = useCallback(
    async (input) => {
      // Include tags and locale in creation request
      if (input.type === CollectionType.SmartCollection) {
        input.tags = tags
        input.locale = router.locale
      }
      if (collection === undefined) {
        // Create collection
        const newCollection = await createCollectionMutation(input)
        if (onCreate !== undefined) {
          onCreate(newCollection)
          onClose(undefined)
        } else {
          router.push(Routes.CollectionPage({ collectionId: newCollection.id }))
        }
      } else {
        // Existing collection
        input.id = collection.id
        const updatedCollection = await updateCollectionMutation(input)
        if (onUpdate !== undefined) {
          onUpdate(updatedCollection)
          onClose(undefined)
        } else {
          router.reload()
        }
      }
    },
    [
      tags,
      createCollectionMutation,
      collection,
      onClose,
      onUpdate,
      onCreate,
      router,
      updateCollectionMutation,
    ]
  )

  const collectionTypeOptions: RadioFieldOptions = []

  if (
    initialTags.length === 0 &&
    (collection === undefined || collection.type !== CollectionType.SmartCollection)
  ) {
    if (availableTypes === undefined || availableTypes.includes(CollectionType.PrivateCollection)) {
      collectionTypeOptions.push({
        value: CollectionType.PrivateCollection,
        label: <T _str="Persönliche Sammlung" />,
        description: personalCollectionDescription,
      })
    }
    if (availableTypes === undefined || availableTypes.includes(CollectionType.JointCollection)) {
      collectionTypeOptions.push({
        value: CollectionType.JointCollection,
        label: <T _str="Gemeinsame Sammlung" />,
        description: jointCollectionDescription,
      })
    }
  }

  if (
    (collection === undefined || collection.type === CollectionType.SmartCollection) &&
    (availableTypes === undefined || availableTypes.includes(CollectionType.SmartCollection))
  ) {
    collectionTypeOptions.push({
      value: CollectionType.SmartCollection,
      label: <T _str="Smarte Sammlung" />,
      description: smartCollectionDescription,
    })
  }

  return (
    <Modal title={modalTitle} onClose={onClose}>
      <p className={styles["create-collection-modal__copy"]}>
        <T _str="Du bist dabei, eine neue Sammlung zu erstellen. Du kannst nun entscheiden, ob du die Sammlung allein bearbeitest oder auch andere Nutzer*innen Bilder und Tags zu deiner Sammlung beitragen können. Smarte Sammlungen werden von picsome automatisch mit Bildern befüllt, die deine vordefinierten Tags enthalten." />
      </p>
      <Form
        onSubmit={onSubmit}
        initialValues={{
          title: initialTitle,
          type: initialType,
        }}
      >
        <FormSpy
          subscription={{ values: true }}
          onChange={(changes) =>
            setTagsFieldVisible(changes.values.type === CollectionType.SmartCollection)
          }
        />

        <div className={styles["create-collection-modal__field"]}>
          <LabeledTextField name="title" label={titleLabel} placeholder={titleLabel} required />
        </div>

        <div className={styles["create-collection-modal__field"]}>
          <RadioField name="type" label={typeLabel} options={collectionTypeOptions} />
        </div>

        {tagsFieldVisible && (
          <div className={styles["create-collection-modal__field"]}>
            <label>
              <span className={styles["create-collection-modal__label"]}>
                <T _str="Smarte Tags einfügen" />
              </span>
              <Autocomplete
                value={tags}
                onChange={(newTags) => {
                  console.log("newTags", newTags)
                  setTags(newTags)
                }}
                placeholder="Tagsuche…"
              />
            </label>
          </div>
        )}

        <div className={styles["create-collection-modal__submit"]}>
          <button type="submit" className="button button--small">
            {submitLabel}
          </button>
        </div>
      </Form>
    </Modal>
  )
}

export default CollectionModal
