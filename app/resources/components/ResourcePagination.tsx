import Button from "app/core/components/Button"
import Loader from "app/core/components/Loader"
import PaginationNavigation from "app/core/components/PaginationNavigation"
import ResourcePreview from "app/core/components/ResourcePreview"
import emptyImage from "../../../public/empty-account.png"
import getResources, { GetResourcesInput } from "../queries/getResources"
import getSearchResources, { GetSearchResourcesInput } from "app/search/queries/getSearchResources"
import styles from "./ResourcePagination.module.scss"
import { Image, usePaginatedQuery } from "blitz"
import { T } from "@transifex/react"
import { useEffect, useState } from "react"
import { ResourceGallery } from "./ResourceGallery"

export const ResourcePagination = (props: {
  title?: JSX.Element | string
  query?: GetResourcesInput
  searchQuery?: GetSearchResourcesInput
  gallery?: boolean
}): JSX.Element => {
  const { gallery = true } = props

  if ((props.query === undefined) === (props.searchQuery === undefined)) {
    throw new Error("Missing or ambiguous resource pagination query")
  }

  // Gather take and skip from above
  const take = props.query?.take ?? props.searchQuery?.take ?? 30
  const skip = props.query?.skip ?? props.searchQuery?.skip ?? 0
  const [currentSkip, setCurrentSkip] = useState(skip)
  const [selectedResourceIndex, setSelectedResourceIndex] = useState<number | undefined>(undefined)

  // Reset skip when query changes
  useEffect(() => {
    setCurrentSkip(0)
  }, [props.query, props.searchQuery])

  // Use paginated resource query
  const [paginatedResources, resourcesQuery] = usePaginatedQuery(
    props.query !== undefined ? getResources : getSearchResources,
    {
      ...(props.query ?? {}),
      ...(props.searchQuery ?? {}),
      take,
      skip: currentSkip,
    } as any,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      keepPreviousData: true,
      suspense: true,
    }
  )

  const onGalleryPrev = (): void => {
    if (selectedResourceIndex !== undefined) {
      const m = paginatedResources.items.length
      setSelectedResourceIndex((m + selectedResourceIndex - 1) % m)
    }
  }

  const onGalleryNext = (): void => {
    if (selectedResourceIndex !== undefined) {
      const m = paginatedResources.items.length
      setSelectedResourceIndex((selectedResourceIndex + 1) % m)
    }
  }

  const onGalleryClose = (): void => {
    setSelectedResourceIndex(undefined)
  }

  const onPaginationPrev = (): void => {
    setCurrentSkip(Math.max(currentSkip - take, 0))
  }

  const onPaginationNext = (): void => {
    setCurrentSkip(currentSkip + take)
  }

  return (
    <div className={styles["resource-pagination"]}>
      <div className={styles["resource-pagination__header"]}>
        <h2 className={styles["resource-pagination__headline"]}>
          <T _str="Bilder" />
        </h2>
        <div className={styles["resource-pagination__pagination"]}>
          <PaginationNavigation
            take={take}
            skip={currentSkip}
            count={paginatedResources.count}
            onPrevNavigation={onPaginationPrev}
            onNextNavigation={onPaginationNext}
          />
        </div>
      </div>
      <div className={styles["resource-pagination__content"]}>
        {resourcesQuery.isFetching && (
          <div className={styles["resource-pagination__slide"]}>
            <div className={styles["resource-pagination__slide-copy"]}>
              <p>
                <T _str="Warte bitte, während wir deine Bilder aufbereiten…" />
              </p>
              <Loader />
            </div>
          </div>
        )}
        {resourcesQuery.isError && (
          <div className={styles["resource-pagination__slide"]}>
            <div className={styles["resource-pagination__slide-copy"]}>
              <p>
                <T _str="Leider konnten wir keine Bilder abrufen. Bitte überprüfe deine Internetverbindung oder versuche es erneut." />
              </p>
              <Button
                label={<T _str="Erneut versuchen" />}
                onClick={() => resourcesQuery.refetch()}
              />
            </div>
          </div>
        )}
        {!resourcesQuery.isFetching && paginatedResources.count === 0 && (
          <div className={styles["resource-pagination__slide"]}>
            <div className={styles["resource-pagination__slide-copy"]}>
              <p>
                <T _str="Leider konnten wir kein Ergebnis für deine Suche finden, bitte versuche es erneut." />
              </p>
            </div>
            <Image
              className={styles["resource-pagination__slide-image"]}
              src={emptyImage}
              alt="No search results"
            />
          </div>
        )}
        {!resourcesQuery.isFetching && paginatedResources.count > 0 && (
          <div className={styles["resource-pagination__items"]}>
            {paginatedResources.items.map((resource, index) => (
              <ResourcePreview
                key={resource.id}
                resource={resource}
                onClick={gallery ? setSelectedResourceIndex.bind(null, index) : undefined}
              />
            ))}
          </div>
        )}
      </div>
      <div className={styles["resource-pagination__navigation"]}>
        <div className={styles["resource-pagination__footer"]}>
          <div></div>
          <div className={styles["resource-pagination__pagination"]}>
            <PaginationNavigation
              take={take}
              skip={currentSkip}
              count={paginatedResources.count}
              onPrevNavigation={onPaginationPrev}
              onNextNavigation={onPaginationNext}
            />
          </div>
        </div>
      </div>
      {selectedResourceIndex !== undefined &&
        paginatedResources.items[selectedResourceIndex] !== undefined && (
          <ResourceGallery
            resource={paginatedResources.items[selectedResourceIndex]!}
            onPrevNavigation={onGalleryPrev}
            onNextNavigation={onGalleryNext}
            onClose={onGalleryClose}
          />
        )}
    </div>
  )
}
