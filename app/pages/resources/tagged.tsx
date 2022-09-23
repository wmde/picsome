import Grid from "app/core/components/Grid"
import Layout from "app/core/layouts/Layout"
import ResourcePreview from "app/core/components/ResourcePreview"
import getResources from "app/resources/queries/getResources"
import styles from "./resource.module.scss"
import { BlitzPage, invokeWithMiddleware, GetServerSideProps } from "blitz"
import { T } from "@transifex/react"

const ResourcesTaggedPage: BlitzPage = (props: TaggedServerSideProps) => {
  return (
    <main>
      <Grid>
        <h1 className={styles.intro}>
          <T _str="Entdecke die picsome Welt" />
        </h1>
      </Grid>
      <Grid modifier="gap">
        {props.paginatedResources.items.map((resource) => (
          <ResourcePreview key={resource.id} resource={resource} />
        ))}
      </Grid>
    </main>
  )
}

export type TaggedServerSideProps = {
  paginatedResources: Awaited<ReturnType<typeof getResources>>
}

export const getServerSideProps: GetServerSideProps<TaggedServerSideProps> = async (ctx) => {
  // Get tagged resources
  const paginatedResources = await invokeWithMiddleware(
    getResources,
    {
      where: { NOT: { tags: { none: {} } } },
    },
    ctx
  )
  return {
    props: {
      paginatedResources: paginatedResources,
    },
  }
}

ResourcesTaggedPage.authenticate = false
ResourcesTaggedPage.getLayout = (page) => <Layout>{page}</Layout>

export default ResourcesTaggedPage
