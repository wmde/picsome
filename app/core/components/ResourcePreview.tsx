import ConditionalWrapper from "./ConditionalWrapper"
import PrivilegedCollectModal from "./PrivilegedCollectModal"
import TagItem from "app/core/components/Tag"
import classNames from "classnames"
import styles from "./ResourcePreview.module.scss"
import { CCLicense, CreatorIcon, PlusIcon } from "app/core/components/Icons"
import { LicensedAndTaggedResource } from "app/resources/queries/getResources"
import { Link, Routes } from "blitz"
import { LogoBrand, MinusIcon } from "./Icons"
import { ResourceImage } from "./ResourceImage"
import { T } from "@transifex/react"
import { scrollAtom } from "app/core/state"
import { useAtom } from "jotai"
import { useState } from "react"

export type ResourcePreviewProps = {
  editable?: boolean
  addable?: boolean
  deleteFunc?: () => void
  resource: LicensedAndTaggedResource
  as?: "hero"
  onClick?: () => void
}

const ResourcePreview = (props: ResourcePreviewProps) => {
  const { resource, editable, deleteFunc, as, addable } = props
  const hasTags = resource.tags && resource.tags.length > 0

  const [showCollectModal, setShowCollectModal] = useState(false)

  const isHero = as === "hero" ? true : false

  const style = { "--width": "span 3" } as React.CSSProperties

  const [, setScroll] = useAtom(scrollAtom)

  return (
    <>
      <div
        className={classNames(styles.item, {
          [styles.itemHero as string]: isHero,
        })}
        style={style}
      >
        <ConditionalWrapper
          condition={props.onClick === undefined}
          wrapper={(children) => (
            <Link href={Routes.ResourcePage({ resourceId: resource.id })}>
              <a
                className={styles.button}
                onClick={() => {
                  setScroll(window.scrollY)
                }}
              >
                {children}
              </a>
            </Link>
          )}
          elseWrapper={(children) => (
            <button type="button" className={styles.button} onClick={props.onClick}>
              {children}
            </button>
          )}
        >
          <ResourceImage
            resource={resource}
            layout="fill"
            objectFit="cover"
            sizes="640px"
            unoptimized={true}
          />
          {hasTags && !isHero && (
            <span className={styles.curated}>
              <LogoBrand />
            </span>
          )}
        </ConditionalWrapper>
        <div className={styles.hover}>
          <div className={styles.top}>
            <span className={styles.action}>
              <T _str="Bild ansehen" />
            </span>
            {editable && (
              <div
                className={styles.add}
                onClick={(e) => {
                  e.preventDefault()
                  deleteFunc && deleteFunc()
                }}
              >
                <MinusIcon />
              </div>
            )}
            {addable && (
              <button
                className={styles.add}
                onClick={(e) => {
                  e.preventDefault()
                  setShowCollectModal(!showCollectModal)
                }}
              >
                <PlusIcon />
              </button>
            )}
          </div>
          <div className={styles.footer}>
            <div className={styles.label}>
              <CreatorIcon />
              {resource.authorName !== "" && <span>{resource.authorName}</span>}
              {resource.authorName === "" && (
                <span>
                  <T _str="Urheber*in nicht bekannt" />
                </span>
              )}
            </div>
            <div className={styles.label}>
              <CCLicense color="#ffffff" />
              <span>{resource.license?.title}</span>
            </div>
          </div>
        </div>
      </div>
      {hasTags && isHero && (
        <ul className={styles.tags}>
          {resource.tags.map((tag, i) => (
            <li key={i} className={styles.tags__item}>
              <TagItem item={tag} />
            </li>
          ))}
        </ul>
      )}
      <PrivilegedCollectModal
        resource={resource}
        showModal={showCollectModal}
        onClose={(event) => setShowCollectModal(false)}
      />
    </>
  )
}

export default ResourcePreview
