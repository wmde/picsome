import styles from "./ResourceGallery.module.scss"
import { LicensedAndTaggedResource } from "../queries/getResources"
import { ResourceImage } from "app/core/components/ResourceImage"
import { ArrowRight, CCLicense, Close, CreatorIcon, PlusIcon } from "app/core/components/Icons"
import { T, useT } from "@transifex/react"
import { Link, Routes } from "blitz"
import PrivilegedCollectModal from "app/core/components/PrivilegedCollectModal"
import { useState } from "react"
import Grid from "app/core/components/Grid"

export const ResourceGallery = (props: {
  resource: LicensedAndTaggedResource
  onPrevNavigation?: () => void
  onNextNavigation?: () => void
  onClose?: () => void
}) => {
  const resource = props.resource
  const prevButtonTitle = useT("Zurück")
  const nextButtonTitle = useT("Weiter")
  const closeButtonTitle = useT("Schließen")
  const collectButtonTitle = useT("Sammeln")
  const [showCollectModal, setShowCollectModal] = useState(false)
  return (
    <div className={styles["resource-gallery"]} role="dialog" aria-modal tabIndex={-1}>
      <button
        title={closeButtonTitle}
        className={styles["resource-gallery__backdrop"]}
        onClick={props.onClose}
      >
        <Close className={styles["resource-gallery__close"]} />
      </button>
      <div className={styles["resource-gallery__centered"]}>
        <Grid>
          <div className={styles["resource-gallery__dialog"]}>
            <div className={styles["resource-gallery__image-row"]}>
              <button
                title={prevButtonTitle}
                className={styles["resource-gallery__btn-prev"]}
                onClick={props.onPrevNavigation}
              >
                <ArrowRight />
              </button>
              <div className={styles["resource-gallery__image"]}>
                <div className={styles["resource-gallery__ratio"]}>
                  <ResourceImage
                    layout="fill"
                    objectFit="contain"
                    resource={resource}
                    thumbnail={false}
                    blurPreview={false}
                  />
                </div>
                <button
                  title={collectButtonTitle}
                  className={styles["resource-gallery__btn-collect"]}
                  onClick={() => setShowCollectModal(true)}
                >
                  <PlusIcon />
                </button>
              </div>
              <button
                title={nextButtonTitle}
                className={styles["resource-gallery__btn-next"]}
                onClick={props.onNextNavigation}
              >
                <ArrowRight />
              </button>
            </div>
            <div className={styles["resource-gallery__detail"]}>
              <div className={styles["resource-gallery__detail-lead"]}>
                <div className={styles["resource-gallery__creator"]}>
                  <CreatorIcon />
                  {resource.authorName !== "" && <span>{resource.authorName}</span>}
                  {resource.authorName === "" && (
                    <span>
                      <T _str="Urheber*in nicht bekannt" />
                    </span>
                  )}
                </div>
                <div className={styles["resource-gallery__license"]}>
                  <CCLicense color="#ffffff" />
                  <span>{resource.license?.title}</span>
                </div>
              </div>
              <div className={styles["resource-gallery__detail-end"]}>
                <Link href={Routes.ResourcePage({ resourceId: resource.id })}>
                  <a className={styles["resource-gallery__btn-detail"]}>
                    <T _str="Bilddetails anzeigen" />
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </Grid>
      </div>
      <PrivilegedCollectModal
        resource={resource}
        showModal={showCollectModal}
        onClose={() => setShowCollectModal(false)}
      />
    </div>
  )
}
