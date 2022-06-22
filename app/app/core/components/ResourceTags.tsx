import { useRouter, useQuery, useMutation } from "blitz"
import { SyntheticEvent, useState } from "react"
import styles from "./ResourceTags.module.scss"
import createMyTag from "app/tags/mutations/createMyTag"
import deleteMyTag from "app/tags/mutations/deleteMyTag"
import { AutocompletePlus, DeleteTagIcon } from "app/core/components/Icons"
import { Autocomplete } from "app/core/components/Autocomplete"
import { useT, T } from "@transifex/react"
import { PrivilegedActionModal } from "app/auth/components/PrivilegedActionModal"
import getTags from "app/tags/queries/getTags"
import { Tag } from "./Tag"

export type ResourceTagsProps = {
  userId: number | null
  resourceId: number
  isPartOfFeaturedCollection?: boolean
}

export const ResourceTags = (props: ResourceTagsProps) => {
  const { userId, resourceId, isPartOfFeaturedCollection = false } = props

  const { locale } = useRouter()

  const [tags, { setQueryData }] = useQuery(getTags, { resourceId })

  const [createTagMutation] = useMutation(createMyTag)
  const [deleteTagMutation] = useMutation(deleteMyTag)

  //console.log(isPartOfFeaturedCollection)

  // we need to disable editing abilities for all images inside the featured resource
  const isUneditableForCommonUsers = isPartOfFeaturedCollection && userId !== 1

  // check if user can edit tags
  const hasTagEditAbility = isUneditableForCommonUsers ? false : userId !== null ? true : false

  // filter for this user's tags
  const myTagsFiltered =
    hasTagEditAbility &&
    tags &&
    tags.filter((t, i) => {
      return t.userId === userId
    })

  const addTag = async (tag: any) => {
    const { id, label, description = "" } = tag
    const fullTagData = {
      wdId: id,
      wikidataItemWdId: id,
      resourceId,
      label,
      description,
      userId: userId ? userId : 1,
    }

    setQueryData(
      [
        ...tags,
        {
          ...fullTagData,
          id: 9999999,
        },
      ],
      { refetch: false }
    )

    await createTagMutation({ ...fullTagData, locale })
  }

  const removeTag = async (tagId: number) => {
    setQueryData(
      tags.filter(({ id }) => {
        return id !== tagId
      }),
      { refetch: false }
    )
    await deleteTagMutation({ id: tagId, resourceId })
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
      {!isUneditableForCommonUsers && (
        <AddTagsButton
          tags={myTagsFiltered}
          editable={hasTagEditAbility}
          add={addTag}
          remove={removeTag}
        />
      )}
    </div>
  )
}

const AddTagsButton = (props: {
  tags: any
  editable: boolean
  add: (tag: any) => void
  remove: (tagId: number) => void
}) => {
  const { tags, editable = false, add, remove } = props

  // This state controls if the UI is currently showing the edit view
  const [editingTags, setEditingTags] = useState(false)

  return (
    <>
      {editingTags && (
        <>
          {editable ? (
            <MyTags tags={tags} onDone={() => setEditingTags(false)} add={add} remove={remove} />
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

const MyTags = (props: {
  tags: any
  onDone: (event: SyntheticEvent) => void
  add: (tag: any) => void
  remove: (tagId: number) => void
}) => {
  const { tags, add, remove } = props

  const placeholder = useT("Tags hinzufügen")

  return (
    <div className={styles.topic__my}>
      <h3 className={styles.topic__headline}>
        <T _str="Meine Tags" />
      </h3>
      {tags && tags.length > 0 && (
        <div className={styles.topic__list}>
          {tags.map((tag, i) => (
            <Tag
              key={i}
              item={tag}
              onDelete={() => {
                remove(tag.id)
              }}
              secondary
            />
          ))}
        </div>
      )}
      <div className={styles.tagsearch}>
        <Autocomplete
          onChange={(tags) => add(tags[0]!)}
          placeholder={placeholder}
          single
          secondary
          icon={<AutocompletePlus className="autocomplete-icon" />}
        />
      </div>
    </div>
  )
}
