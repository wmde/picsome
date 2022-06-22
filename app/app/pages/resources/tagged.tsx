import { BlitzPage, invokeWithMiddleware, GetServerSideProps } from "blitz"
import Layout from "app/core/layouts/Layout"
import getResourcesTagged from "app/resources/queries/getResourcesTagged"
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

const ResourcesTaggedPage: BlitzPage = (props: any) => {
  return (
    <main>
      <Grid>
        <h1 className={styles.intro}>
          <T _str="Entdecke die picsome Welt" />
        </h1>
      </Grid>
      <Grid modifier="gap">
        <ResourcesList {...props} />
      </Grid>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps<any> = async (ctx) => {
  const resources = await invokeWithMiddleware(getResourcesTagged, {}, ctx)

  if (!resources) return { notFound: true }

  return {
    props: {
      ...resources,
    },
  }
}

ResourcesTaggedPage.authenticate = false
ResourcesTaggedPage.getLayout = (page) => <Layout>{page}</Layout>

export default ResourcesTaggedPage
