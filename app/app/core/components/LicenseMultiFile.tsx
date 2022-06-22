import { Image, useQuery, useRouter } from "blitz"
import styles from "./LicenseMultiFile.module.scss"
import { T } from "@transifex/react"
import { useEffect, useState } from "react"
import LicenseLoader from "app/core/components/LicenseLoader"
import getWikipediaResources from "app/check/queries/getWikipediaResources"
import Error from "./Error"
import { SuccessIcon } from "./Icons"

export type LicenseMultiFileProps = {
  url: string
  showError?: boolean | string
  setError?: (e: boolean) => void
  createResource: ({ resourceUrl: string }) => Promise<any>
  onAssetsEmptyError: () => void
}

const LicenseMultiFile = (props: LicenseMultiFileProps) => {
  const { url, showError, setError, createResource, onAssetsEmptyError, ...rest } = props

  const [loading, setLoading] = useState(false)
  const [newUrl, setNewUrl] = useState(url)

  const [assets] = useQuery(getWikipediaResources, { url: url }, { keepPreviousData: true })

  const createResourceFromUrl = async (url: string) => {
    setNewUrl(url)
    setLoading(true)
    setError && setError(false)

    try {
      createResource({ resourceUrl: url })
    } catch (e) {
      console.warn("Create Resource failed", e)
    }
  }

  if (!assets) {
    onAssetsEmptyError()
  }

  useEffect(() => {
    if (showError) setLoading(false)
  }, [showError])

  return (
    <div className={styles.asset__container} {...rest}>
      {!loading && (
        <>
          <h2 className={styles.asset__list__headline}>
            <T _str="Welches dieser Bilder möchtest du verwenden?" />
          </h2>
          <span className={styles.loader__url}>{url}</span>
        </>
      )}
      {showError && !loading && (
        <Error text="Wie schade, dieses Bild können wir leider nicht untersuchen! Vermutlich stammt es von einer Bildersammlung, die picsome derzeit nicht unterstützt." />
      )}
      {!loading && (
        <div className={styles.asset__list}>
          {(assets || []).map((asset: any, i: number) => (
            <div
              key={i}
              className={styles.asset__item}
              onClick={() => createResourceFromUrl(asset.descriptionUrl)}
            >
              <Image
                alt={asset.title}
                src={asset.thumbnail.rawUrl}
                layout="fill"
                objectFit="cover"
                unoptimized={true}
              />
              <div className={styles.asset__overlay}>
                <div className={styles.asset__overlayIcon}>
                  <SuccessIcon />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {loading && <LicenseLoader headline="Lizenz wird geprüft.." url={newUrl} />}
    </div>
  )
}

export default LicenseMultiFile
