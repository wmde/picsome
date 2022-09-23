import classNames from "classnames"
import styles from "./CollectionTypeIndicator.module.scss"
import { CollectionType } from "db"
import { PersonIcon, SmartCollectionIcon, UserGroupIcon, OtherCollectionIcon } from "./Icons"
import { T } from "@transifex/react"

/**
 * Component rendering the type of a collection.
 */
const CollectionTypeIndicator = (props: { type: CollectionType; isOwner?: boolean }) => {
  const { type, isOwner = false } = props
  return (
    <span
      className={classNames(styles["collection-type-indicator"], {
        [styles["collection-type-indicator--joint"] as string]: type === "JointCollection",
      })}
    >
      <span className={styles["collection-type-indicator__icon"]}>
        {type === CollectionType.PrivateCollection && <PersonIcon />}
        {type === CollectionType.JointCollection && isOwner && <UserGroupIcon />}
        {type === CollectionType.JointCollection && !isOwner && <OtherCollectionIcon />}
        {type === CollectionType.SmartCollection && <SmartCollectionIcon />}
      </span>
      {type === CollectionType.PrivateCollection && <T _str="Persönliche Sammlung" />}
      {type === CollectionType.JointCollection && <T _str="Gemeinsame Sammlung" />}
      {type === CollectionType.SmartCollection && <T _str="Smarte Sammlung" />}
    </span>
  )
}

export default CollectionTypeIndicator
