import { Suspense } from "react"
import { Head, usePaginatedQuery, useRouter, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import Grid from "app/core/components/Grid"
import Loader from "app/core/components/Loader"
import getCollections from "app/collections/queries/getCollections"
import CollectionPreview from "app/core/components/CollectionPreview"
import { ArrowButton } from "app/core/components/ArrowButton"
import Row from "app/core/components/Row"
import { T } from "@transifex/react"
import styles from "./collections.module.scss"
import classNames from "classnames"

const ITEMS_PER_PAGE = 12

export const CollectionsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  // EXAMPLE: http://localhost:3000/collections?wdId=Q1754

  const { wdId } = router.query

  let where = {}

  if (wdId) {
    where = { items: { some: { resource: { tags: { some: { wdId } } } } } }
  }

  const [{ items: collections, hasMore }, { isPreviousData }] = usePaginatedQuery(getCollections, {
    where,
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <>
      {collections.map((collection, i) => {
        return <CollectionPreview key={i} collection={collection} />
      })}

      <div
        className={classNames(styles.pagination, {
          [styles.pagination__full as string]: page !== 0,
        })}
      >
        {page !== 0 && (
          <ArrowButton href="#" onClick={goToPreviousPage} reverse={true}>
            <T _str="Vorherige Sammlungen" />
          </ArrowButton>
        )}
        {!isPreviousData && hasMore && (
          <ArrowButton href="#" onClick={goToNextPage}>
            <T _str="Weitere Sammlungen" />
          </ArrowButton>
        )}
      </div>
    </>
  )
}

const CollectionsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Collections</title>
      </Head>

      <Grid modifier="gap">
        <Row>
          <h2>
            <T _str="Sammlungen entdecken" />
          </h2>
        </Row>
      </Grid>
      <Grid modifier="collections">
        <Suspense fallback={<Loader />}>
          <CollectionsList />
        </Suspense>
      </Grid>
    </>
  )
}

CollectionsPage.authenticate = false
CollectionsPage.getLayout = (page) => <Layout>{page}</Layout>

export default CollectionsPage
