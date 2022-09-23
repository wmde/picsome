import createMyTag from "app/tags/mutations/createMyTag"
import deleteMyTag from "app/tags/mutations/deleteMyTag"
import getTags from "app/tags/queries/getTags"
import styles from "./ResourceTags.module.scss"
import { Autocomplete } from "app/core/components/Autocomplete"
import { AutocompletePlus } from "app/core/components/Icons"
import { PrivilegedActionModal } from "app/auth/components/PrivilegedActionModal"
import { SyntheticEvent, useState } from "react"
import { Tag } from "./Tag"
import { WikidataItem } from "../services/wikidata"
import { useRouter, useQuery, useMutation } from "blitz"
import { useT, T } from "@transifex/react"

export type ResourceTagsProps = {
  userId: number | null
  resourceId: number
  featured: boolean
}

type Tag = Awaited<ReturnType<typeof getTags>>[number]

const adminUserId = 1

export const ResourceTags = (props: ResourceTagsProps) => {
  const { userId, resourceId, featured } = props

  const { locale } = useRouter()

  const [tags, { setQueryData }] = useQuery(getTags, { resourceId })
  const [createTagMutation] = useMutation(createMyTag)
  const [deleteTagMutation] = useMutation(deleteMyTag)

  // Featured resources are only editable by admin users
  // TODO: Use check for user role 'ADMIN' instead of user id '1'
  const isEditableByLoggedInUsers = !featured
  const isEditable = (isEditableByLoggedInUsers && userId !== null) || userId === adminUserId

  // Filter user tags
  const userTags = isEditable && tags.filter((tag) => tag.userId === userId)

  const addTag = async (item: WikidataItem) => {
    if (userId === null) {
      // User not logged in
      return
    }

    if (tags.find((tag) => item.id === tag.wdId) !== undefined) {
      // Tag already added
      return
    }

    // Create new tag
    const newTag: Omit<Tag, "id"> = {
      wdId: item.id,
      wikidataItemWdId: item.id,
      resourceId,
      label: item.label,
      description: item.description ?? "",
      userId,
    }

    // Optimistic update of viewed tags (using a fake id)
    const optimisticNewTags = [...tags, { ...newTag, id: -1 }]
    setQueryData(optimisticNewTags, { refetch: false })

    try {
      // Request the addition of the tag in the backend and update local tags
      const updatedTags = await createTagMutation({ ...newTag, locale })
      setQueryData(updatedTags, { refetch: false })
    } catch (error) {
      // Undo the local optimistic changes on error
      setQueryData(tags, { refetch: false })
    }
  }

  const removeTag = async (wdId: string) => {
    if (userId === null) {
      // User not logged in
      return
    }

    // Optimistic update of viewed tags
    const optimisticNewTags = tags.filter((tag) => tag.wdId !== wdId)
    if (tags.length === optimisticNewTags.length) {
      // Nothing changed
      return
    }

    setQueryData(optimisticNewTags, { refetch: false })

    try {
      // Request the addition of the tag in the backend and update local tags
      const updatedTags = await deleteTagMutation({ wdId, resourceId })
      setQueryData(updatedTags, { refetch: false })
    } catch (error) {
      // Undo the local optimistic changes on error
      setQueryData(tags, { refetch: false })
    }
  }

  return (
    <div className={styles.tags}>
      {tags && tags.length > 0 && (
        <h3 className={styles.topic__headline}>
          <T _str="Tags, die andere Nutzer*innen verwendet haben" />
        </h3>
      )}
      {tags && tags.length > 0 && (
        <div className={styles.topic__list}>
          {tags.length > 0 && tags.map((tag, i) => <Tag key={i} item={tag} secondary />)}
        </div>
      )}
      {((tags && tags.length === 0) || !tags) && (
        <span>
          <T _str="Zu diesem Bild wurden noch keine Tags hinzugefügt." />
        </span>
      )}
      {(isEditableByLoggedInUsers || isEditable) && (
        <AddTagsButton tags={userTags} editable={isEditable} onAdd={addTag} onRemove={removeTag} />
      )}
    </div>
  )
}

const AddTagsButton = (props: {
  tags: any
  editable: boolean
  onAdd: (item: WikidataItem) => void
  onRemove: (wdId: string) => void
}) => {
  const { tags, editable = false, onAdd, onRemove } = props
  const [editingTags, setEditingTags] = useState(false)
  return (
    <>
      {editingTags && (
        <>
          {editable ? (
            <EditTagControl
              tags={tags}
              onDone={() => setEditingTags(false)}
              onAdd={onAdd}
              onRemove={onRemove}
            />
          ) : (
            <PrivilegedActionModal onClose={() => setEditingTags(false)} />
          )}
        </>
      )}
      <div className={styles.tag__button}>
        <button className="button button--small" onClick={() => setEditingTags(!editingTags)}>
          {editingTags ? <T _str="Fertig" /> : <T _str="Tags hinzufügen" />}
        </button>
      </div>
    </>
  )
}

const EditTagControl = (props: {
  tags: any
  onDone: (event: SyntheticEvent) => void
  onAdd: (item: WikidataItem) => void
  onRemove: (wdId: string) => void
}) => {
  const { tags, onAdd, onRemove } = props
  const placeholder = useT("Tags hinzufügen")
  return (
    <div className={styles.topic__my}>
      <h3 className={styles.topic__headline}>
        <T _str="Meine Tags" />
      </h3>
      {tags && tags.length > 0 && (
        <div className={styles.topic__list}>
          {tags.map((tag, index) => (
            <Tag key={index} item={tag} onDelete={onRemove.bind(null, tag.wdId)} secondary />
          ))}
        </div>
      )}
      <div className={styles.tagsearch}>
        <Autocomplete
          onChange={(tags) => onAdd(tags[0]!)}
          placeholder={placeholder}
          single
          secondary
          icon={<AutocompletePlus className="autocomplete-icon" />}
        />
      </div>
    </div>
  )
}
