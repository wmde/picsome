import { useRouter, Image, Head, useQuery, Routes } from "blitz"
import { ReactElement, useCallback } from "react"
import Layout from "app/core/layouts/Layout"
import React, { ReactNode, Suspense, useEffect, useState } from "react"
import getResources from "app/resources/queries/getResources"
import getSearchCollections from "app/collections/queries/getCollectionsForSearch"
import CollectionPreview from "app/core/components/CollectionPreview"
import Grid from "app/core/components/Grid"
import Loader from "app/core/components/Loader"
import ResourcePreview from "app/core/components/ResourcePreview"
import styles from "./search.module.scss"
import { ArrowButton } from "app/core/components/ArrowButton"
import { T, useT } from "@transifex/react"
import emptyImage from "../../../public/empty-account.png"
import _ from "lodash"
import {
  LicenseFeatureValue,
  LicenseGroupValue,
  Prisma,
  ResourceAspect,
  ResourceFileformat,
  ResourceSize,
  CollectionType,
} from "db"
import { scrollAtom, searchAtom } from "app/core/state"
import { atom, useAtom, SetStateAction, WritableAtom, Atom } from "jotai"
import { atomWithReset, RESET, useHydrateAtoms, useResetAtom } from "jotai/utils"
import getLicenseGroups from "app/resources/queries/getLicenseGroups"
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
import { Filter, FilterElem, GroupFilter } from "app/search/types"

const ITEMS_PER_PAGE = 30

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
//   router.push({ pathname: Routes.Search().pathname, query: newQuery }, undefined, {
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
      <span
        onClick={() => {
          if (usable) toggle(elem.v)
        }}
      >
        {icon && icon}
        {title || v}
      </span>
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
      <h4
        className={styles.accordion__header}
        onClick={() => {
          setOpen(!open)
        }}
      >
        {header} <AccordionArrow />
      </h4>
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

export type SearchResultProps = {
  hideCollections: boolean
  hideImages: boolean
}

/**
 * Empty Search
 * @returns
 */
const SearchEmpty = () => {
  const router = useRouter()

  useEffect(() => {
    router.push(Routes.Home())
  }, [router])

  return (
    <Grid>
      <Loader />
    </Grid>
  )
}

/**
 * Let's search for items
 * @param props
 * @returns
 */
const SearchResults = (props: SearchResultProps) => {
  const { hideCollections, hideImages } = props
  // const page = Number(router.query.page) || 0
  const [searchItems] = useAtom(searchAtom)

  const tagWdIds = searchItems?.map((item) => item.id) || []

  let whereClauseForResources: Prisma.ResourceWhereInput = {}
  let whereClauseForCollections: Prisma.CollectionWhereInput = {}
  let wdIds: string[] | undefined = undefined

  // Resource detail filters
  let resourceDetailFilter: Prisma.ResourceDetailsWhereInput = {}
  const [sizes] = useAtom(sizeQueryAtom)
  if (sizes.length) {
    resourceDetailFilter = { ...resourceDetailFilter, size: { in: sizes } }
  }
  const [aspects] = useAtom(aspectQueryAtom)
  if (aspects.length) {
    resourceDetailFilter = { ...resourceDetailFilter, aspect: { in: aspects } }
  }
  const [formats] = useAtom(formatQueryAtom)
  if (formats.length) {
    resourceDetailFilter = { ...resourceDetailFilter, fileformat: { in: formats } }
  }
  whereClauseForResources = { ...whereClauseForResources, details: resourceDetailFilter }
  // END Resource Details Filter

  // LICENSE Filters
  let licenseGroupFilter: Prisma.LicenseGroupWhereInput = {}
  const [features] = useAtom(featuresQueryAtom)
  if (features.length > 0) {
    licenseGroupFilter = {
      ...licenseGroupFilter,
      features: { some: { id: { in: features } } },
    }
  }
  const [groups] = useAtom(groupsQueryAtom)
  if (groups.length > 0) {
    licenseGroupFilter = { ...licenseGroupFilter, id: { in: groups } }
  }
  whereClauseForResources = { ...whereClauseForResources, license: { group: licenseGroupFilter } }
  // END License Filters

  wdIds = tagWdIds

  whereClauseForResources = {
    ...whereClauseForResources,
  }

  whereClauseForCollections = {
    AND:
      tagWdIds &&
      tagWdIds.map((wdId) => ({
        items: { some: { resource: { tags: { some: { wdId } } } } },
      })),
  }

  const [curated] = useAtom(curatedAtom)
  // END TAG filters

  const [resources] = useQuery(
    getResources,
    {
      curated,
      where: whereClauseForResources,
      orderBy: { id: "asc" },
      wdIds,
      take: 50,
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      keepPreviousData: false,
      suspense: true,
    }
  )

  const [collections] = useQuery(
    getSearchCollections,
    {
      where: whereClauseForCollections,
      orderBy: { id: "asc" },
      take: 3,
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      keepPreviousData: false,
      suspense: true,
    }
  )

  const showEmptyState =
    collections && collections?.length === 0 && resources && resources.length === 0

  const [scroll] = useAtom(scrollAtom)

  useEffect(() => {
    window.scrollTo(0, scroll)
  }, [scroll])

  return (
    <div className={styles.wrapper}>
      {collections && collections?.length > 0 && !hideCollections && (
        <div className={styles.collection__container}>
          <div className={styles.collection__header}>
            <h2>
              <T _str="Sammlungen" />
            </h2>
            {/* {hasMoreCollections && (
              <ArrowButton href="#">
                <T _str="Weitere Sammlungen" />
              </ArrowButton>
            )} */}
          </div>
          <div className={styles.collection__results}>
            {collections.map((collection, i) => (
              <CollectionPreview key={i} collection={collection} />
            ))}
          </div>
        </div>
      )}
      {resources.length > 0 && !hideImages && (
        <div className={styles.resources__container}>
          {/* <div className={styles.container}>
           <Grid modifier="gap"> */}
          <div className={styles.collection__header}>
            <h2>
              <T _str="Bilder" />
            </h2>
            {/* {hasMoreResources && (
               <ArrowButton href="#">
                 <T _str="Weitere Bilder" />
               </ArrowButton>
             )} */}
          </div>
          {/* </Grid> */}
          <div className={styles.resources__list}>
            {/* <Grid modifier="gap"> */}
            {resources.map((resource) => (
              <ResourcePreview key={resource.thumbUrl} resource={resource} />
            ))}
            {/* </Grid> */}
          </div>
          {/* </div> */}
        </div>
      )}
      {showEmptyState && (
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
    </div>
  )
}

//type ServerSideProps = InferGetServerSidePropsType<typeof getServerSideProps>

const SearchWithResults = (props: any) => {
  const { licenseGroups } = props

  const [searchState, setSearchState] = useState("all")

  // TODO: Hydrate & Reuse filter state
  const [filterActive, setFilterState] = useState(false)

  // tab controls
  const [hideCollections, setHideCollections] = useState(false)
  const [hideImages, setHideImages] = useState(false)

  useHydrateAtoms([
    [
      groupsAtom,
      licenseGroups.map((g) => {
        return { extra: g, v: g.id, selected: false, usable: true }
      }),
    ],
  ] as const)

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
            <div className={styles.filter__container}>
              <div
                className={styles.filter__reset}
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
              </div>
              <h4>
                <T _str="Aus unseren Sammlungen" />
              </h4>
              <ul className={classNames(styles.filter, styles.curated)}>
                <li
                  className={classNames({
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
            </div>
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
  return { props: { items, licenseGroups } }
}

export const Search = (props: any) => {
  const { items } = props

  const title = useT("Suche")

  useHydrateAtoms(items && items.length > 0 ? ([[searchAtom, items]] as const) : [])

  const [searchItems] = useAtom(searchAtom)

  return (
    <>
      <Head>
        <title>{`${title}`}</title>
      </Head>
      {searchItems && searchItems.length === 0 ? <SearchEmpty /> : <SearchWithResults {...props} />}
    </>
  )
}

/** ###########################
 * END EARCH LOGIC
 * ###########################
 */

Search.suppressFirstRenderFlicker = true
Search.getLayout = (page) => <Layout>{page}</Layout>

export default Search
