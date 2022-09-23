import { Suspense } from "react"
import { useRouter, BlitzPage, invokeWithMiddleware, GetServerSideProps } from "blitz"
import Layout from "app/core/layouts/Layout"
import getResourcesTagFree from "app/resources/queries/getResourcesTagFree"
import Grid from "app/core/components/Grid"
import ResourcePreview from "app/core/components/ResourcePreview"
import { T } from "@transifex/react"
import styles from "./resource.module.scss"

export const ResourcesList = (props: any) => {
  const { resources } = props

  return resources.map(
    (resource) => resource && <ResourcePreview key={resource.id} resource={resource} />
  )
}

const ResourcesTagFreePage: BlitzPage = (props: any) => {
  return (
    <main>
      <Grid>
        <h1 className={styles.intro}>
          <T _str="Bilder ohne Tags" />
        </h1>
      </Grid>
      <Grid modifier="gap">
        <ResourcesList {...props} />
      </Grid>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps<any> = async (ctx) => {
  const resources = await invokeWithMiddleware(getResourcesTagFree, {}, ctx)

  if (!resources) return { notFound: true }

  return {
    props: {
      ...resources,
    },
  }
}

ResourcesTagFreePage.authenticate = false
ResourcesTagFreePage.getLayout = (page) => <Layout>{page}</Layout>

export default ResourcesTagFreePage
