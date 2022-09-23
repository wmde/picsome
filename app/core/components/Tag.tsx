import { Tag as TagItem } from "db"
import { useT } from "@transifex/react"
import { MouseEventHandler } from "react"
import { WikidataItem } from "../services/wikidata"
import { DeleteX } from "./Icons"
import styles from "./Tag.module.scss"
import classNames from "classnames"

export const Tag = (props: {
  // the any needs to go, check in resourcetags
  item: WikidataItem | TagItem | any
  onClick?: MouseEventHandler
  onDelete?: MouseEventHandler
  secondary?: boolean
}) => {
  const deleteLabel = useT("Entfernen")
  return (
    <>
      {props.onClick ? (
        <button className={styles.tag} onClick={props.onClick}>
          <span className={styles.tagLabel}>{props.item.label}</span>
        </button>
      ) : (
        <span
          className={classNames(styles.tag, {
            [styles.tag__secondary as string]: props.secondary,
          })}
        >
          <span className={styles.tagLabel}>{props.item.label}</span>
          {props.onDelete && (
            <button className={styles.deleteButton} title={deleteLabel} onClick={props.onDelete}>
              <DeleteX />
            </button>
          )}
        </span>
      )}
    </>
  )
}

export default Tag
