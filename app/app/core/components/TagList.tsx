import { MouseEventHandler } from "react"
import { WikidataItem } from "../services/wikidata"
import styles from "./TagList.module.scss"
import Tag from "./Tag"

const TagList = (props: {
  items: WikidataItem[]
  onClick?: MouseEventHandler
  onDelete?: MouseEventHandler
}) => {
  return (
    <ul className={styles["tag-list"]}>
      {props.items.map((item) => (
        <li key={item.id} className={styles["tag-list__item"]}>
          <Tag item={item} onClick={props.onClick} onDelete={props.onDelete} />
        </li>
      ))}
    </ul>
  )
}

export default TagList
