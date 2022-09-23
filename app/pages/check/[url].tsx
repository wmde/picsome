import Grid from "app/core/components/Grid"
import Layout from "../../core/layouts/Layout"
import LicenseLoader from "app/core/components/LicenseLoader"
import LicenseMultiFile from "app/core/components/LicenseMultiFile"
import createResourcesForUrl from "app/check/mutations/createResourcesForUrl"
import styles from "./check.module.scss"
import { BackButton } from "app/core/components/BackButton"
import { InferGetServerSidePropsType, Routes, useMutation, useRouter } from "blitz"
import { Resource } from "db"
import { Suspense, useEffect, useState } from "react"
import { T, useT } from "@transifex/react"
import { isUrl } from "integrations/license-check/libs/utils"

type ServerSideProps = InferGetServerSidePropsType<typeof getServerSideProps>

export type CheckUrlProps = ServerSideProps & {
  url: string
  isMultiUrl: boolean
  assets?: any
}

const CheckUrl = (props: CheckUrlProps) => {
  const { url, isMultiUrl } = props

  const router = useRouter()

  const [showError, setError] = useState(
    router.params && router.params.showError ? (router.params.showError as string) : false
  )
  const [loading, setLoading] = useState(true)

  /**
   * Success handler for creating a single image.
   * Either single image license check or multi license check with selection.
   */
  const onCreateResourceSuccess = (resources: Resource[]) => {
    if (resources.length === 0) {
      onCreateResourceError()
    } else {
      const resource = resources[0]!
      if (isMultiUrl) {
        // Go back to the image selection page when going back in history
        router.push(Routes.ResourcePage({ resourceId: resource.id }))
      } else {
        // Go back to the license checker when going back in history
        router.replace(Routes.ResourcePage({ resourceId: resource.id }))
      }
    }
  }

  /**
   * Error can be triggered from its child, the LicenseMultiFile if necessary
   */
  const onCreateResourceError = () => {
    if (!isMultiUrl) {
      // For a single resource we go back to the initial Check Route
      router.push(Routes.Check({ showError: true }))
    } else {
      // For multi urls, we want to re-render license multi file with an error message
      setError(true)
    }
  }

  /**
   * Triggered when no assets can be found for a given url within the LicenseMultiFile component
   */
  const onAssetsEmptyError = () => {
    router.push(Routes.Check({ showError: true }))
  }

  const [createResourceMutation] = useMutation(createResourcesForUrl, {
    onSuccess: onCreateResourceSuccess,
    onError: onCreateResourceError,
  })

  useEffect(() => {
    if (isMultiUrl === false) {
      createResourceMutation({ resourceUrl: url, limit: 1 })
    }
  }, [createResourceMutation, isMultiUrl, url])

  const loaderHeadline = useT("Dein Lizenzhinweis wird gerade für dich erstellt ...")

  return (
    <div className={styles.license}>
      {isMultiUrl && (
        <Grid>
          <div className={styles.backRow}>
            <BackButton>
              <T _str="Zurück" />
            </BackButton>
          </div>
        </Grid>
      )}
      <Grid>
        {loading && !isMultiUrl && <LicenseLoader headline={loaderHeadline} url={url} />}
        {isMultiUrl && (
          <Suspense fallback={<LicenseLoader headline={loaderHeadline} url={url} />}>
            <LicenseMultiFile
              url={url}
              createResource={createResourceMutation}
              setError={setError}
              showError={showError}
              onAssetsEmptyError={onAssetsEmptyError}
            />
          </Suspense>
        )}
      </Grid>
    </div>
  )
}

export const getServerSideProps = async ({ query }) => {
  const url = query.url

  // redirect safely if no URL was provided
  if (!url || !isUrl(url)) {
    return {
      redirect: {
        destination: Routes.Check(),
        permanent: false,
      },
    }
  }

  const parsedUrl = new URL(url)
  return {
    props: { url: url, isMultiUrl: parsedUrl.hostname.indexOf("wikipedia.org") !== -1 }, // will be passed to the page component as props
  }
}

CheckUrl.suppressFirstRenderFlicker = true
CheckUrl.getLayout = (page) => <Layout>{page}</Layout>

export default CheckUrl
