import CollectionTypeIndicator from "./CollectionTypeIndicator"
import ConditionalWrapper from "./ConditionalWrapper"
import React from "react"
import classNames from "classnames"
import styles from "./CollectionPreview.module.scss"
import { AddIcon, MinusIcon, SuccessIcon } from "./Icons"
import { Link, Routes } from "blitz"
import { ResourceImage } from "./ResourceImage"
import { T } from "@transifex/react"
import { CollectionWithResources } from "app/collections/queries/getCollection"

export type CollectionPreviewProps = {
  collection: CollectionWithResources
  selected?: boolean
  onSelectChange?: (selected: boolean) => void
  small?: boolean
  hero?: boolean
  isOwner?: boolean
}

export const CollectionPreview = (props: CollectionPreviewProps) => {
  const {
    onSelectChange,
    selected = false,
    small = false,
    hero = false,
    collection,
    isOwner = false,
  } = props

  const className = classNames(styles["collection-preview"], {
    [styles["collection-preview--small"] as string]: small,
    [styles["collection-preview--selected"] as string]: selected,
    [styles["collection-preview--hero"] as string]: hero,
  })

  return (
    <ConditionalWrapper
      condition={onSelectChange === undefined}
      wrapper={(children) => (
        <Link href={Routes.CollectionPage({ collectionId: collection.id })}>
          <a className={className}>{children}</a>
        </Link>
      )}
      elseWrapper={(children) => (
        <button
          className={className}
          onClick={(event) => onSelectChange && onSelectChange(!selected)}
        >
          {children}
        </button>
      )}
    >
      <div className={styles["collection-preview__inner"]}>
        <div className={styles["collection-preview__cover"]}>
          <div className={styles["collection-preview__resources"]}>
            {collection.resources &&
              collection.resources.slice(0, 3).map((resource, index) => (
                <div key={index} className={styles["collection-preview__resource"]}>
                  <ResourceImage
                    resource={resource}
                    objectFit="cover"
                    layout="fill"
                    sizes="320px"
                    unoptimized={true}
                  />
                </div>
              ))}
          </div>
          {onSelectChange !== undefined && (
            <div className={styles["collection-preview__overlay"]}>
              <div className={styles["collection-preview__overlay-icon-minus"]}>
                <MinusIcon />
              </div>
              <div className={styles["collection-preview__overlay-icon-add"]}>
                <AddIcon />
              </div>
              <div className={styles["collection-preview__overlay-icon-check"]}>
                <SuccessIcon />
              </div>
            </div>
          )}
        </div>
        <div className={styles["collection-preview__detail"]}>
          <span className={styles["collection-preview__detail-title"]}>{collection.title}</span>
          {!small && (
            <>
              <span className={styles["collection-preview__detail-count"]}>
                {collection.count !== 1 ? (
                  <T _str="{count} Fotos" count={collection.count} />
                ) : (
                  <T _str="1 Foto" />
                )}
              </span>
              <span className={styles["collection-preview__detail-type"]}>
                <CollectionTypeIndicator type={collection.type} isOwner={isOwner} />
              </span>
            </>
          )}
        </div>
      </div>
    </ConditionalWrapper>
  )
}

export default CollectionPreview
