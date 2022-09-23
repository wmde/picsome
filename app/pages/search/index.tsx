import { useRouter, Image, Head, useQuery, Routes, usePaginatedQuery } from "blitz"
import { ReactElement, useCallback } from "react"
import Layout from "app/core/layouts/Layout"
import React, { ReactNode, Suspense, useEffect, useState } from "react"
import CollectionPreview from "app/core/components/CollectionPreview"
import Grid from "app/core/components/Grid"
import Loader from "app/core/components/Loader"
import ResourcePreview from "app/core/components/ResourcePreview"
import styles from "./search.module.scss"
import { T, useT } from "@transifex/react"
import emptyImage from "../../../public/empty-account.png"
import _ from "lodash"
import {
  LicenseFeatureValue,
  LicenseGroupValue,
  ResourceAspect,
  ResourceFileformat,
  ResourceSize,
  CollectionType,
  LicenseFeature,
  LicenseGroup,
} from "db"
import { scrollAtom, searchAtom } from "app/core/state"
import { atom, useAtom, SetStateAction, WritableAtom, Atom } from "jotai"
import { atomWithReset, RESET, useHydrateAtoms, useResetAtom } from "jotai/utils"
import getLicenseGroups from "app/licenses/queries/getLicenseGroups"
import Button from "app/core/components/Button"
import {
  AccordionArrow,
  Big,
  Filter as FilterIcon,
  Landscape,
  LogoBrand,
  Medium,
  Portrait,
  Small,
  Square,
} from "app/core/components/Icons"
import classNames from "classnames"
import { WikidataItem } from "app/core/services/wikidata"
import { getTagsByWdIds } from "app/tags/queries/getTagsByWdIds"
import Tag from "app/core/components/Tag"
import getRelatedItemsByWdIds from "app/tags/queries/getRelatedItemsByWdIds"
import CollectionModal from "app/core/components/CollectionModal"
import { ArrowButton } from "app/core/components/ArrowButton"
import getSearchResources, { GetSearchResourcesInput } from "app/search/queries/getSearchResources"
import getSearchCollections from "app/search/queries/getSearchCollections"
import { useNumberFormatter } from "app/core/hooks/useNumberFormatter"
import { ResourcePagination } from "app/resources/components/ResourcePagination"
import PaginationNavigation from "app/core/components/PaginationNavigation"

export type FilterElem<V, E> = { v: V; selected: boolean; usable: boolean; extra?: E }
export type Filter<V, E> = Array<FilterElem<V, E>>

export type Group = LicenseGroup & { features: LicenseFeature[] }
export type GroupFilter = Filter<LicenseGroupValue, Group>

interface SearchPageProps {
  items: WikidataItem[]
  licenseGroups: Awaited<ReturnType<typeof getLicenseGroups>>
}

/**
 *
 * FILTER LOGIC
 */

function toggleFilter<V, E>(v: V, filter: Filter<V, E>, toggleUsable?: boolean): Filter<V, E> {
  return filter.map((f) => {
    const selected = f.v === v ? !f.selected : f.selected
    return { ...f, selected }
  })
}

function initFilterElem<V, E>(v: V, e?: E): FilterElem<V, E> {
  return { v, selected: false, usable: true, extra: e }
}

function initFilter<V, E>(vs: object): Filter<V, E> {
  const elems = Object.values(vs).map((v) => initFilterElem(v))
  return elems as Filter<V, E>
}

function filterToQuery<V, E>(vs: Filter<V, E>): V[] {
  return vs.filter(({ selected }) => selected).map(({ v }) => v)
}

function toggleGroupFilterByFeatures(
  activeFeatures: LicenseFeatureValue[],
  filter: GroupFilter
): GroupFilter {
  return filter.map((f) => {
    // console.log("FILTER", filter)
    const features = new Set(f.extra?.features.map((ft) => ft.id))
    let { usable, selected } = f
    usable = _.every(activeFeatures.map((feat) => features.has(feat)))
    selected = usable ? selected : false
    return { ...f, selected, usable }
  })
}

const groupsAtom = atom<GroupFilter>([]) // these come from the DB so we cant use the resetatom

const groupsQueryAtom = atom((get) => filterToQuery(get(groupsAtom)))

const toggleGroupAtom = atom(
  (get) => get(groupsAtom),
  (get, set, action: LicenseGroupValue) => {
    set(groupsAtom, toggleFilter(action, get(groupsAtom)))
  }
)

const resetGroupAtom = atom(
  (get) => get(groupsAtom),
  (get, set, _action) => {
    set(
      groupsAtom,
      get(groupsAtom).map((elem) => {
        return { ...elem, selected: false, usable: true }
      })
    )
  }
)

const featuresAtom = atomWithReset<Filter<LicenseFeatureValue, void>>([
  { v: LicenseFeatureValue.Commercial, selected: false, usable: true },
  { v: LicenseFeatureValue.Modify, selected: false, usable: true },
])

const featuresQueryAtom = atom((get) => filterToQuery(get(featuresAtom)))

const toggleFeaturesAtom = atom(
  (get) => get(featuresAtom),
  (get, set, action: LicenseFeatureValue) => {
    set(featuresAtom, toggleFilter(action, get(featuresAtom)))
    set(groupsAtom, toggleGroupFilterByFeatures(get(featuresQueryAtom), get(groupsAtom)))
  }
)

function makeFilterAtoms<V, E>(
  vs: object
): [
  WritableAtom<Filter<V, E>, SetStateAction<Filter<V, E>> | typeof RESET>,
  Atom<V[]>,
  WritableAtom<Filter<V, E>, V, void>
] {
  const baseAtom = atomWithReset(initFilter<V, E>(vs))
  const queryAtom = atom((get) => filterToQuery(get(baseAtom)))
  const toggleAtom = atom(
    (get) => get(baseAtom),
    (get, set, action: V) => {
      set(baseAtom, toggleFilter(action, get(baseAtom)))
    }
  )
  return [baseAtom, queryAtom, toggleAtom]
}

const [aspectAtom, aspectQueryAtom, toggleAspectAtom] = makeFilterAtoms<ResourceAspect, void>(
  ResourceAspect
)

const [sizeAtom, sizeQueryAtom, toggleSizeAtom] = makeFilterAtoms<ResourceSize, void>(ResourceSize)

const [formatAtom, formatQueryAtom, toggleFormatAtom] = makeFilterAtoms<ResourceFileformat, void>(
  ResourceFileformat
)

const curatedAtom = atomWithReset(false)

// const updatePath = () => {
//   const newQuery = { ...currQuery, groups, features }
//   router.push({ pathname: Routes.SearchPage().pathname, query: newQuery }, undefined, {
//     shallow: true,
//   })
// }

function FilterComponent<V, E>({
  filterAtom,
  sort,
  title = "",
}: {
  filterAtom: WritableAtom<Filter<V, E>, V, void>
  sort?: boolean
  title?: string
}) {
  const [filter, setToggleFilter] = useAtom(filterAtom)

  const order = [
    "Public Domain",
    "PD",
    "CC0",
    "CCBY",
    "CCBYSA",
    "CCBYNC",
    "CCBYNCSA",
    "CCBYND",
    "CCBYNCND",
  ]

  if (sort) {
    filter.sort(({ v: va }, { v: vb }) => {
      return order.indexOf(va as unknown as string) - order.indexOf(vb as unknown as string)
    })
  }

  return (
    <ul className={classNames(styles[title], styles.filter)}>
      {filter.map((elem) => (
        <FilterElemComponent
          key={elem.v as unknown as string}
          elem={elem}
          toggle={setToggleFilter}
        />
      ))}
    </ul>
  )
}

function FilterElemComponent<V, E>({
  elem,
  toggle,
}: {
  elem: FilterElem<V, E>
  toggle: (update: SetStateAction<V>) => void
}) {
  const { usable, selected, v } = elem

  let title = ""
  let icon: undefined | ReactElement<any, any> = undefined

  /* FIlter Translations */
  const commercial = useT("kommerziell nutzen")
  const modify = useT("bearbeiten")
  const portrait = useT("hochkant")
  const landscape = useT("querformat")
  const square = useT("quadratisch")
  const big = useT("groß")
  const medium = useT("mittel")
  const small = useT("klein")

  switch (v as unknown as string) {
    case "PD":
      title = "Public Domain"
      break
    case "CCBY":
      title = "CC BY"
      break
    case "CCBYSA":
      title = "CC BY-SA"
      break
    case "CCBYND":
      title = "CC BY-ND"
      break
    case "CCBYNC":
      title = "CC BY-NC"
      break
    case "CCBYNCSA":
      title = "CC BY-NC-SA"
      break
    case "CCBYNCND":
      title = "CC BY-NC-ND"
      break
    case "CC0":
      title = "CC 0"
      break
    case "Commercial":
      title = commercial
      break
    case "Modify":
      title = modify
      break
    case "Portrait":
      title = portrait
      icon = <Portrait />
      break
    case "Landscape":
      title = landscape
      icon = <Landscape />
      break
    case "Square":
      title = square
      icon = <Square />
      break
    case "Big":
      title = big
      icon = <Big />
      break
    case "Medium":
      title = medium
      icon = <Medium />
      break
    case "Small":
      title = small
      icon = <Small />
      break
  }

  return (
    <li
      className={classNames({
        [styles.filter__selected as string]: selected,
        [styles.filter__unusable as string]: !usable,
      })}
    >
      <button
        onClick={() => {
          if (usable) toggle(elem.v)
        }}
        className={classNames(styles["filter__button"], styles.trigger)}
      >
        <span>
          <>
            {icon && icon}
            {title || v}
          </>
        </span>
      </button>
    </li>
  )
}

/**
 *
 * END FILTER LOGIC
 *
 */

/**
 * RELATED TAGS
 */

const RelatedTags = (props: {
  items: WikidataItem[]
  selectItem: (item: WikidataItem, event: MouseEvent) => void
}) => {
  // ("related tags items", props)
  const searchWdIds = props.items.map((item) => item.id)
  const [relatedItems] = useQuery(getRelatedItemsByWdIds, searchWdIds)

  if (!relatedItems || relatedItems.length === 0) {
    return null
  }

  return (
    <Grid>
      <div className={styles["related-tags"]}>
        <span className={styles["related-tags__label"]}>
          <T _str="Verwandte Tags" />
        </span>
        <div className={styles["related-tags__scrollarea"]}>
          <ul className={styles["related-tags__list"]}>
            {relatedItems.slice(0, 16).map((item, index) => (
              <li className={styles["related-tags__item"]} key={index}>
                <Tag item={item} onClick={props.selectItem.bind(null, item)} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Grid>
  )
}

/**
 * END RELATED TAGS
 */

/**
 * ACCORDION
 */

export type AccordionProps = {
  children?: ReactNode
  header?: ReactNode
}

const Accordion = (props: AccordionProps) => {
  const { children, header } = props
  const [open, setOpen] = useState(false)

  return (
    <div className={classNames(styles.accordion, { [styles.accordion__open as string]: open })}>
      <button
        onClick={() => {
          setOpen(!open)
        }}
        tabIndex={0}
        className={styles.trigger}
      >
        {" "}
        <h3 className={styles.accordion__header}>
          {header} <AccordionArrow />
        </h3>
      </button>
      {children}
    </div>
  )
}

/**
 * END ACCORDION
 */

/**
 * ###########################
 * SEARCH LOGIC
 * ###########################
 */

interface SearchResultsProps {
  hideCollections: boolean
  hideImages: boolean
}

const collectionsPerPage = 6
const resourcesPerPage = 30

const SearchResults = (props: SearchResultsProps) => {
  const { hideCollections, hideImages } = props

  const [collectionsPage, setCollectionsPage] = useState(0)

  const [searchTags] = useAtom(searchAtom)
  const [curated] = useAtom(curatedAtom)
  const [sizes] = useAtom(sizeQueryAtom)
  const [aspects] = useAtom(aspectQueryAtom)
  const [fileFormats] = useAtom(formatQueryAtom)
  const [licenseFeatures] = useAtom(featuresQueryAtom)
  const [licenseGroups] = useAtom(groupsQueryAtom)

  // Reset page when changing search keywords or filters
  useEffect(() => {
    setCollectionsPage(0)
  }, [
    searchTags,
    curated,
    sizes,
    aspects,
    fileFormats,
    licenseFeatures,
    licenseGroups,
    setCollectionsPage,
  ])

  const resourceSearchQuery: GetSearchResourcesInput = {
    wikidataIds: searchTags.map((tag) => tag.id),
    filters: {
      curated,
      sizes,
      aspects,
      fileFormats,
      licenseFeatures,
      licenseGroups,
    },
    take: resourcesPerPage,
  }

  const takeCollections = collectionsPerPage
  const skipCollections = collectionsPerPage * collectionsPage

  const [paginatedCollections, collectionsQuery] = usePaginatedQuery(
    getSearchCollections,
    {
      wikidataIds: searchTags.map((tag) => tag.id),
      take: takeCollections,
      skip: skipCollections,
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      keepPreviousData: true,
      suspense: true,
    }
  )

  const [scroll] = useAtom(scrollAtom)
  useEffect(() => {
    window.scrollTo(0, scroll)
  }, [scroll])

  return (
    <div className={styles.wrapper}>
      {(hideImages || paginatedCollections.count > 0) && !hideCollections && (
        <div
          className={classNames(styles.resultset, {
            [styles["resultset--collections"] as string]: true,
          })}
        >
          <div className={styles.resultset__header}>
            <h2 className={styles.resultset__headline}>
              <T _str="Sammlungen" />
            </h2>
            <div className={styles.resultset__pagination}>
              <PaginationNavigation
                take={takeCollections}
                skip={skipCollections}
                count={paginatedCollections.count}
                onNextNavigation={() => setCollectionsPage(collectionsPage + 1)}
                onPrevNavigation={() => setCollectionsPage(collectionsPage - 1)}
              />
            </div>
          </div>
          {!collectionsQuery.isFetching && paginatedCollections.count > 0 && (
            <div className={styles.resultset__items}>
              {paginatedCollections.items.map((collection, i) => (
                <CollectionPreview key={i} collection={collection} />
              ))}
            </div>
          )}
          {!collectionsQuery.isFetching && paginatedCollections.count === 0 && (
            <div className={styles.emptyresults}>
              <div className={styles.emptyresults__text}>
                <T _str="Leider konnten wir kein Ergebnis für deine Suche finden, bitte versuche es erneut." />
              </div>
              <Image
                className={styles.emptyresults__image}
                src={emptyImage}
                alt="empty search results"
              />
            </div>
          )}
          {collectionsQuery.isFetching && (
            <div className={styles.resultset__loading}>
              <Loader />
            </div>
          )}
          <div className={styles.resultset__footer}>
            <div />
            <div className={styles.resultset__pagination}>
              <PaginationNavigation
                take={takeCollections}
                skip={skipCollections}
                count={paginatedCollections.count}
                onNextNavigation={() => setCollectionsPage(collectionsPage + 1)}
                onPrevNavigation={() => setCollectionsPage(collectionsPage - 1)}
              />
            </div>
          </div>
        </div>
      )}
      {!hideImages && (
        <div className={styles["resource-pagination"]}>
          <ResourcePagination title={<T _str="Bilder" />} searchQuery={resourceSearchQuery} />
        </div>
      )}
    </div>
  )
}

const SearchPageWithResults = (props: SearchPageProps) => {
  const { licenseGroups } = props

  const [searchState, setSearchState] = useState("all")

  // TODO: Hydrate & Reuse filter state
  const [filterActive, setFilterState] = useState(false)

  // tab controls
  const [hideCollections, setHideCollections] = useState(false)
  const [hideImages, setHideImages] = useState(false)

  const hydrateAtomValue = licenseGroups.map((licenseGroup) => ({
    extra: licenseGroup,
    v: licenseGroup.id,
    selected: false,
    usable: true,
  }))
  useHydrateAtoms([[groupsAtom, hydrateAtomValue]] as const)

  const [searchItems, setSearchItems] = useAtom(searchAtom)

  // console.log("SEARCH ITEMS WITH RESULT", searchItems)
  //setSearchItems(undefined)
  const onSelectRelatedItem = useCallback(
    (item: WikidataItem, event: MouseEvent) => {
      setSearchItems(searchItems.filter((selectedTag) => selectedTag.id !== item.id).concat([item]))
    },
    [searchItems, setSearchItems]
  )

  const [showCreateCollectionModal, setShowCreateCollectionModal] = useState(false)

  const resetApect = useResetAtom(aspectAtom)
  const resetSize = useResetAtom(sizeAtom)
  const resetFormat = useResetAtom(formatAtom)
  const [, resetGroups] = useAtom(resetGroupAtom)
  const resetFeatures = useResetAtom(featuresAtom)
  const resetCurated = useResetAtom(curatedAtom)
  const [filterCurated, setCurated] = useAtom(curatedAtom)

  return (
    <>
      <Suspense fallback="">
        {searchItems && <RelatedTags items={searchItems} selectItem={onSelectRelatedItem} />}
      </Suspense>

      <Grid>
        <div className={styles.bar}>
          <div className={styles.tabs}>
            <Button
              as="primary"
              onClick={() => {
                setSearchState(!filterActive ? "images" : searchState)
                setFilterState(!filterActive)

                // TODO: check for searcchState!!!!!!!!!!!
                setHideImages(false)
                setHideCollections(!filterActive ? true : false)
              }}
            >
              <span className={styles.filter__toggle}>
                {!filterActive && (
                  <>
                    <FilterIcon /> <T _str="Filter anzeigen" />
                  </>
                )}
                {filterActive && (
                  <>
                    <FilterIcon /> <T _str="Filter verbergen" />
                  </>
                )}
              </span>
            </Button>
            <div className={styles.tabs__secondary}>
              <Button
                as="secondary"
                onClick={() => {
                  setSearchState("all")
                  setFilterState(false)
                  setHideCollections(false)
                  setHideImages(false)
                }}
                active={searchState === "all"}
              >
                <T _str="Alle" />
              </Button>
              <Button
                as="secondary"
                onClick={() => {
                  setSearchState("collections")
                  setFilterState(false)
                  setHideCollections(false)
                  setHideImages(true)
                }}
                active={searchState === "collections"}
              >
                <T _str="Sammlungen" />
              </Button>
              <Button
                as="secondary"
                onClick={() => {
                  setSearchState("images")
                  setHideCollections(true)
                  setHideImages(false)
                }}
                active={searchState === "images"}
              >
                <T _str="Bilder" />
              </Button>
            </div>
          </div>
          <div className={styles.actionButtons}>
            <Button
              as="primary"
              onClick={() => {
                setShowCreateCollectionModal(true)
              }}
            >
              <T _str="Sammlung erstellen" />
            </Button>
          </div>
        </div>
      </Grid>
      <div
        className={classNames(styles.result__container, {
          [styles.result__filters as string]: filterActive,
        })}
      >
        <Grid>
          {filterActive && (
            <section className={styles.filter__container}>
              <button
                className={classNames(styles.filter__reset, styles.trigger)}
                onClick={() => {
                  resetApect()
                  resetSize()
                  resetFormat()
                  resetGroups()
                  resetFeatures()
                  resetCurated()
                }}
              >
                <T _str="Filter zurücksetzen" />
              </button>
              <h3>
                <T _str="Aus unseren Sammlungen" />
              </h3>
              <ul className={classNames(styles.filter, styles.curated)}>
                <li>
                  <button
                    className={classNames(styles.trigger, {
                      [styles.filter__selected as string]: filterCurated,
                    })}
                    onClick={() => {
                      setCurated(!filterCurated)
                    }}
                  >
                    <span>
                      <LogoBrand />
                      <T _str="Empfohlen" />
                    </span>
                  </button>
                </li>
              </ul>
              <Accordion header={<T _str="Ich möchte das Bild..." />}>
                <FilterComponent title="usage" filterAtom={toggleFeaturesAtom} />
              </Accordion>
              <Accordion header={<T _str="Lizenzen" />}>
                <FilterComponent title="license" filterAtom={toggleGroupAtom} sort={true} />
              </Accordion>
              <Accordion header={<T _str="Dateiformat" />}>
                <FilterComponent title="type" filterAtom={toggleFormatAtom} />
              </Accordion>
              <Accordion header={<T _str="Seitenverhältnis" />}>
                <FilterComponent title="ratio" filterAtom={toggleAspectAtom} />
              </Accordion>
              <Accordion header={<T _str="Bildgröße" />}>
                <FilterComponent title="size" filterAtom={toggleSizeAtom} />
              </Accordion>
            </section>
          )}
          <Suspense
            fallback={
              <div className={styles.result__loader}>
                <Loader />
              </div>
            }
          >
            <SearchResults hideCollections={hideCollections} hideImages={hideImages} />
          </Suspense>
        </Grid>
      </div>

      {showCreateCollectionModal && (
        <CollectionModal
          initialType={CollectionType.SmartCollection}
          initialTags={searchItems}
          onClose={(event) => setShowCreateCollectionModal(false)}
        />
      )}
    </>
  )
}

export const getServerSideProps = async (context) => {
  if (!context.query || !context.query.q) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  // Contains the raw keywords (untrusted)
  const rawKeywords = context.query.q?.split(" ").map(decodeURIComponent) || []

  // Contains the raw Wikidata ids (untrusted)
  const wdIds = context.query.tags?.split(" ").map(decodeURIComponent) || []

  // Fetch existing tags by Wikidata ids (trusted)
  const existingTags = wdIds.length > 0 ? await getTagsByWdIds(wdIds) : []

  const length = Math.max(rawKeywords.length, wdIds.length)

  const items = new Array(length).fill({}).map((_, index) => {
    const wdId: string | undefined = wdIds[index] || undefined
    const existingTag = existingTags.find((existingTag) => existingTag.wdId === wdId)
    const keyword: string | undefined = rawKeywords[index] || undefined
    return {
      id: existingTag?.wdId || wdId || "",
      label: existingTag?.label || keyword || wdId || "",
      description: existingTag?.description || undefined,
    }
  })

  const licenseGroups = await getLicenseGroups(undefined, context)
  const props: SearchPageProps = { items, licenseGroups }
  return { props }
}

export const SearchPage = (props: SearchPageProps) => {
  const { items } = props
  const router = useRouter()
  const title = useT("Suche")
  useHydrateAtoms(items && items.length > 0 ? ([[searchAtom, items]] as const) : [])
  const [searchItems] = useAtom(searchAtom)

  // Handle void search
  useEffect(() => {
    if (searchItems.length === 0) {
      router.push(Routes.Home())
    }
  }, [searchItems, router])

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {searchItems.length === 0 && (
        <Grid>
          <Loader />
        </Grid>
      )}
      {searchItems.length > 0 && <SearchPageWithResults {...props} />}
    </>
  )
}

SearchPage.suppressFirstRenderFlicker = true
SearchPage.getLayout = (page) => <Layout>{page}</Layout>

export default SearchPage
