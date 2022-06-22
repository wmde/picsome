import classNames from "classnames"
import styles from "./ResourcePreview.module.scss"
import { CCLicense, CreatorIcon, PlusIcon } from "app/core/components/Icons"
import { License, Resource, Tag } from "db"
import { Link, Routes } from "blitz"
import { LogoBrand, MinusIcon } from "./Icons"
import PrivilegedCollectModal from "./PrivilegedCollectModal"
import { ResourceImage } from "./ResourceImage"
import { T } from "@transifex/react"
import TagItem from "app/core/components/Tag"
import { scrollAtom } from "app/core/state"
import { useAtom } from "jotai"
import { useState } from "react"

export type ResourcePreviewProps = {
  editable?: boolean
  addable?: boolean
  deleteFunc?: () => void
  resource: Resource & {
    license: License
    tags: Tag[]
  }
  as?: "hero"
}

const ResourcePreview = (props: ResourcePreviewProps) => {
  const { resource, editable, deleteFunc, as, addable } = props
  //const { resolutionX, resolutionY } = resource
  //const aspectratio = resolutionY / resolutionX
  const hasTags = resource.tags && resource.tags.length > 0

  const [showModal, setShowModal] = useState(false)

  const isHero = as === "hero" ? true : false

  //const style = { "--width": aspectratio > 1 ? "span 4" : "span 3" } as React.CSSProperties
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
        <Link href={Routes.ResourcePage({ resourceId: resource.id })}>
          <a
            onClick={() => {
              setScroll(window.scrollY)
            }}
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
                      setShowModal(!showModal)
                    }}
                  >
                    <PlusIcon />
                  </button>
                )}
              </div>
              <div className={styles.footer}>
                <div className={styles.label}>
                  <CreatorIcon />
                  <span>{resource.authorName}</span>
                </div>
                <div className={styles.label}>
                  <CCLicense color="#ffffff" />
                  <span>{resource.license?.title}</span>
                </div>
              </div>
            </div>
          </a>
        </Link>
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
        showModal={showModal}
        onClose={(event) => setShowModal(false)}
      />
    </>
  )
}

export default ResourcePreview
