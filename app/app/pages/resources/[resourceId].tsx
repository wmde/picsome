import React, { ReactFragment, Suspense, useState } from "react"
import {
  Head,
  Link,
  getSession,
  invokeWithMiddleware,
  InferGetServerSidePropsType,
  GetServerSideProps,
  AuthorizationError,
} from "blitz"
import Layout from "app/core/layouts/Layout"
import getResource from "app/resources/queries/getResource"
import Loader from "app/core/components/Loader"
import Grid from "app/core/components/Grid"
import styles from "./resource.module.scss"
import { BackButton } from "app/core/components/BackButton"
import {
  Author,
  CCLicense,
  ImageIcon,
  ExternalLink,
  CheckCircle,
  PlusIcon,
  WarningCircle,
  ForbiddenCircle,
  HelpIcon,
} from "app/core/components/Icons"
import { Resource as ResourceType, LicenseFeature, LicenseFeatureValue } from "db"
import ReportContent from "app/core/components/ReportContent"
import getCollectionsForResource from "app/collections/queries/getCollectionsForResource"
import getResourcesRelated from "app/resources/queries/getResourcesRelated"
import { ResourceTags } from "app/core/components/ResourceTags"
import { T } from "@transifex/react"
import { generateAttribution } from "app/core/utils"
import Row from "app/core/components/Row"
import ResourcePreview from "app/core/components/ResourcePreview"
import CollectionPreview from "app/core/components/CollectionPreview"
import ReactTooltip from "react-tooltip"
import { ResourceImage } from "app/core/components/ResourceImage"
import PrivilegedCollectModal from "app/core/components/PrivilegedCollectModal"

type FeaturePresentation = [ReactFragment | undefined, ReactFragment | undefined]

type ServerSideProps = InferGetServerSidePropsType<typeof getServerSideProps>

export type CopyButtonProps = {
  content: any
  richtext?: boolean
}

export function featurePresentation(features: LicenseFeature[]) {
  const featureValues = features.map((f) => f.id)
  const featureSet = new Set(featureValues)
  const presentations = new Array<FeaturePresentation>()

  for (let f in LicenseFeatureValue) {
    if (featureSet.has(f as LicenseFeatureValue)) {
      presentations.push(getPresentFeaturePresentation(f as LicenseFeatureValue))
    } else {
      presentations.push(getAbsentFeaturePresentation(f as LicenseFeatureValue))
    }
  }

  // if we have modify in the set, we need to display a warning
  if (featureSet.has("Modify" as LicenseFeatureValue)) {
    presentations.push(getWarningFeaturePresentation("Modify" as LicenseFeatureValue))
  }

  const pres = { a: new Array<ReactFragment>(), b: new Array<ReactFragment>() }

  for (let p of presentations) {
    const [a, b] = p
    if (a) pres.a.push(a)
    if (b) pres.b.push(b)
  }
  return pres
}

export function getWarningFeaturePresentation(f: LicenseFeatureValue): FeaturePresentation {
  switch (f) {
    case LicenseFeatureValue.Modify:
      return [
        undefined,
        <>
          <div className={styles.feature} data-tip data-for="tooltipLicenseFeatureModify">
            <WarningCircle />
            <span className={styles.featureLabel}>
              <T _str="Bearbeitungen angeben" />
            </span>
          </div>
          <ReactTooltip
            id="tooltipLicenseFeatureModify"
            type="light"
            effect="solid"
            className={styles.tooltip}
          >
            <T _str="Du musst angeben, ob Änderungen im Sinne von Bearbeitungen vorgenommen wurden." />
          </ReactTooltip>
        </>,
      ]

    default:
      return [undefined, undefined]
  }
}

export function getPresentFeaturePresentation(f: LicenseFeatureValue): FeaturePresentation {
  switch (f) {
    case LicenseFeatureValue.Commercial:
      return [
        <>
          <div className={styles.feature} data-tip data-for="tooltipLicenseFeatureCommercial">
            <CheckCircle />
            <span className={styles.featureLabel}>
              <T _str="Kommerziell nutzen" />
            </span>
          </div>
          <ReactTooltip
            id="tooltipLicenseFeatureCommercial"
            type="light"
            effect="solid"
            className={styles.tooltip}
          >
            <T _str="Du darfst das Bild für kommerzielle Zwecke nutzen. Kommerziell ist eine Nutzung dann, wenn sie in erster Linie auf kommerziell relevante Vorteile oder auf eine Vergütung abzielt." />
          </ReactTooltip>
        </>,
        undefined,
      ]
    case LicenseFeatureValue.Distribute:
      return [
        <>
          <div className={styles.feature} data-tip data-for="tooltipLicenseFeatureDistribute">
            <CheckCircle />
            <span className={styles.featureLabel}>
              <T _str="Teilen" />
            </span>
          </div>
          <ReactTooltip
            id="tooltipLicenseFeatureDistribute"
            type="light"
            effect="solid"
            className={styles.tooltip}
          >
            <T _str="Du darfst das Material in jedwedem Format oder Medium vervielfältigen und weiterverbreiten." />
          </ReactTooltip>
        </>,
        undefined,
      ]
    case LicenseFeatureValue.Modify:
      return [
        <>
          <div className={styles.feature} data-tip data-for="tooltipLicenseFeatureRemix">
            <CheckCircle />
            <span className={styles.featureLabel}>
              <T _str="Bearbeiten" />
            </span>
          </div>
          <ReactTooltip
            id="tooltipLicenseFeatureRemix"
            type="light"
            effect="solid"
            className={styles.tooltip}
          >
            <T _str="Du darfst das Material remixen, verändern und darauf aufbauen und zwar für beliebige Zwecke, sogar kommerziell." />
          </ReactTooltip>
        </>,
        undefined,
      ]
    case LicenseFeatureValue.NameAuthor:
      return [
        undefined,
        <>
          <div className={styles.feature} data-tip data-for="tooltipLicenseFeatureNameAuthor">
            <WarningCircle />
            <span className={styles.featureLabel}>
              <T _str="Namensnennung" />
            </span>
          </div>
          <ReactTooltip
            id="tooltipLicenseFeatureNameAuthor"
            type="light"
            effect="solid"
            className={styles.tooltip}
          >
            <T _str="Du bist verpflichtet, angemessene Urheber- und Rechteangaben zu machen. Urheber*innen müssen in der von ihnen gewünschten Form genannt werden." />
          </ReactTooltip>
        </>,
      ]
    case LicenseFeatureValue.ShareAlike:
      return [
        undefined,
        <>
          <div className={styles.feature} data-tip data-for="tooltipLicenseFeatureShareAlike">
            <WarningCircle />
            <span className={styles.featureLabel}>
              <T _str="Weitergabe unter gleichen Bedingungen" />
            </span>
          </div>
          <ReactTooltip
            id="tooltipLicenseFeatureShareAlike"
            type="light"
            effect="solid"
            className={styles.tooltip}
          >
            <T _str="Wenn du das Bild remixt, veränderst oder anderweitig direkt darauf aufbaust, darfst du deine Beiträge nur unter derselben Lizenz wie das Original - also nur unter der ursprünglichen CC-BY-SA-Lizenz oder einer kompatiblen Lizenz - erneut veröffentlicht werden darf. " />
          </ReactTooltip>
        </>,
      ]
  }
}

export function getAbsentFeaturePresentation(f: LicenseFeatureValue): FeaturePresentation {
  switch (f) {
    case LicenseFeatureValue.Commercial:
      return [
        undefined,
        <>
          <div className={styles.feature} data-tip data-for="tooltipLicenseFeatureCommercial">
            <WarningCircle />
            <span className={styles.featureLabel}>
              <T _str="Keine kommerzielle Nutzung" />
            </span>
          </div>
          <ReactTooltip
            id="tooltipLicenseFeatureCommercial"
            type="light"
            effect="solid"
            className={styles.tooltip}
          >
            <T _str="Du darfst das Bild nicht für kommerzielle Zwecke nutzen. Kommerziell ist eine Nutzung dann, wenn sie in erster Linie auf kommerziell relevante Vorteile oder auf eine Vergütung abzielt." />
          </ReactTooltip>
        </>,
      ]
    case LicenseFeatureValue.Distribute:
      return [
        undefined,
        <>
          <div className={styles.feature} data-tip data-for="tooltipLicenseFeatureDistribute">
            <WarningCircle />
            <span className={styles.featureLabel}>
              <T _str="Alle Rechte vorbehalten" />
            </span>
          </div>
          <ReactTooltip
            id="tooltipLicenseFeatureDistribute"
            type="light"
            effect="solid"
            className={styles.tooltip}
          >
            <T _str="Das bedeutet, dass – bis auf einige Ausnahmen – Nutzungen nur mit Erlaubnis der Urheber*innen rechtlich zulässig sind. Wenn nichts anderes dabei steht und keine individuellen Absprachen getroffen worden sind, darf ein veröffentlichtes Werk nur sehr eingeschränkt von Dritten genutzt werden. Für juristische Laien gilt die Faustformel: Was nicht ausdrücklich erlaubt ist, ist im Zweifel verboten." />
          </ReactTooltip>
        </>,
      ]
    case LicenseFeatureValue.Modify:
      return [
        undefined,
        <>
          <div className={styles.feature} data-tip data-for="tooltipLicenseFeatureModifyRemix">
            <ForbiddenCircle />
            <span className={styles.featureLabel}>
              <T _str="Keine Bearbeitung" />
            </span>
          </div>
          <ReactTooltip
            id="tooltipLicenseFeatureModifyRemix"
            type="light"
            effect="solid"
            className={styles.tooltip}
          >
            <T _str="Du darfst das Material remixen, verändern oder darauf aufbauen, die bearbeitete Fassung des Materials aber nicht verbreiten." />
          </ReactTooltip>
        </>,
      ]

    case LicenseFeatureValue.NameAuthor:
      return [undefined, undefined]
    case LicenseFeatureValue.ShareAlike:
      return [undefined, undefined]
  }
}

const CopyButton = (props: CopyButtonProps) => {
  const { content, richtext = false } = props

  const copyCodeToClipboard = () => {
    if (navigator.clipboard && richtext) {
      const listener = (e) => {
        e.clipboardData.setData("text/html", content)
        e.clipboardData.setData("text/plain", content)
        e.preventDefault()
      }
      document.addEventListener("copy", listener)
      document.execCommand("copy")
      document.removeEventListener("copy", listener)
    } else {
      navigator.clipboard && navigator.clipboard?.writeText(content)
    }
  }

  return (
    <a className={styles.copy} onClick={copyCodeToClipboard}>
      <T _str="Kopieren" />
    </a>
  )
}

const CollectButton = (props: { resource: ResourceType }) => {
  const [showModal, setShowModal] = useState(false)
  return (
    <>
      <button className="button button--small" onClick={() => setShowModal(!showModal)}>
        <PlusIcon />
        <span>
          <T _str="Bild sammeln" />
        </span>
      </button>
      <PrivilegedCollectModal
        resource={props.resource}
        showModal={showModal}
        onClose={(event) => setShowModal(false)}
      />
    </>
  )
}

const calcImageSize = (width: number, height: number) => {
  const ratio = width / height

  // wide images
  if (ratio >= 1) return { width: 630, height: 630 / ratio }

  // tall images (portrait)
  return { width: 630 * ratio, height: 630 }
}

export const Resource = (props: ServerSideProps) => {
  const { resource, userId, paginatedCollections, relatedResources, attribution } = props

  const { license } = resource
  const features = featurePresentation(license.group.features)

  const [isPartOfFeaturedCollection] = paginatedCollections.items.filter((collection) => {
    return collection.id === 1
  })

  return (
    <>
      <Head>
        <title>{resource.title} | picsome</title>
      </Head>

      <Grid>
        <BackButton>
          <T _str="Zurück" />
        </BackButton>

        <div className={styles.intro}>
          <h1 className={styles.headline}>
            <span className={styles.headlineInner}>{resource.title}</span>
          </h1>
          <div className={styles.action__container}>
            <ReportContent resourceId={resource.id} />
            <CollectButton resource={resource} />
          </div>
        </div>

        <div className={styles.left}>
          <div className={styles.image__container}>
            <ResourceImage resource={resource} sizes="640px" layout="fill" objectFit="contain" />
          </div>
        </div>

        <div className={styles.right}>
          {resource.authorUrl !== "" ? (
            <Link href={resource.authorUrl}>
              <a target="_blank" className={styles.info}>
                <Author />
                <span>{resource.authorName}</span>
              </a>
            </Link>
          ) : (
            <div className={styles.info}>
              <Author />
              <span>{resource.authorName}</span>
            </div>
          )}

          <Link href={resource.resourceUrl}>
            <a target="_blank" className={styles.info}>
              <ExternalLink />
              <span>
                {resource.repository === "wikimedia" ? "Wikimedia Commons" : resource.repository}
              </span>
            </a>
          </Link>

          <Link href={license.canonicalUrl}>
            <a target="_blank" className={styles.info}>
              <CCLicense />
              <span>{license.title}</span>
            </a>
          </Link>

          <div className={styles.size}>
            <ImageIcon />
            <span>
              <span>{resource.resolutionX}</span>
              <span>×</span>
              <span>{resource.resolutionY}</span>
            </span>
          </div>

          <div className={styles.features}>
            <div className={styles.features__allowed}>
              <strong>
                <T _str="Du darfst dieses Bild:" />
              </strong>
              <ul className={styles.featureList}>
                {features.a && features.a.map((feature, i) => <li key={i}>{feature}</li>)}
              </ul>
            </div>
            <div className={styles.features__beware}>
              <strong>
                <T _str="Darauf musst du achten:" />
              </strong>
              <ul className={styles.featureList}>
                {features.b && features.b.map((feature, i) => <li key={i}>{feature}</li>)}
              </ul>
            </div>
          </div>

          <div className={styles.tabs__container}>
            <strong>
              <T _str="Lizenzhinweis*" />
            </strong>

            {/* TODO: move to component */}
            <div className={styles.tabs}>
              <div className={styles.tab}>
                <input type="radio" id="license-text" name="licenseTab" defaultChecked />
                <label htmlFor="license-text">
                  <T _str="Text" />
                </label>

                <div className={styles.content}>
                  <div className={styles.scroll__content}>
                    <span dangerouslySetInnerHTML={{ __html: attribution.html }}></span>
                  </div>
                  <CopyButton content={attribution.html} richtext />
                </div>
              </div>
              <div className={styles.tab}>
                <input type="radio" id="license-text-only" name="licenseTab" />
                <label htmlFor="license-text-only">
                  <T _str="Nur Text" />
                </label>

                <div className={styles.content}>
                  <div className={styles.scroll__content}>
                    <span>{attribution.plaintext}</span>
                  </div>
                  <CopyButton content={attribution.plaintext} />
                </div>
              </div>
              <div className={styles.tab}>
                <input type="radio" id="license-html" name="licenseTab" />
                <label htmlFor="license-html">
                  <T _str="HTML" />
                </label>

                <div className={styles.content}>
                  <div className={styles.scroll__content}>
                    <span>{attribution.html}</span>
                  </div>
                  <CopyButton content={attribution.html} />
                </div>
              </div>
            </div>
            <span className={styles.license__agreement}>
              *{" "}
              <T _str="Diese Anwendung soll die lizenzkonforme Nachnutzung von bestimmten urheberrechtlich geschützten Bildern vereinfachen. Sie kann niemals alle möglichen Anwendungsfälle und Besonderheiten abdecken und ersetzt in keinem Fall die qualifizierte juristische Beratung durch einen Anwalt." />
            </span>
          </div>
        </div>
        <Suspense fallback={<Loader />}>
          <ResourceTags
            userId={userId}
            resourceId={resource.id}
            isPartOfFeaturedCollection={isPartOfFeaturedCollection || false}
          />
        </Suspense>
      </Grid>

      {relatedResources.length > 0 && (
        <div className={styles.related}>
          <Grid>
            <Row>
              <h2>
                <T _str="Weitere Bilder mit ähnlichen Tags" n={relatedResources.length} />
              </h2>
            </Row>
          </Grid>
          <Grid modifier="gap">
            {relatedResources.map((resource) => (
              <ResourcePreview key={resource.id} resource={resource} />
            ))}
          </Grid>
        </div>
      )}

      {paginatedCollections.items.length > 0 && (
        <div className={styles.related}>
          <Grid modifier="gap">
            <Row>
              <h2 className={styles.related__headline}>
                <T _str="Sammlungen mit diesem Bild" />
              </h2>
            </Row>
          </Grid>
          <Grid modifier="collections">
            {paginatedCollections.items.map((collection) => (
              <CollectionPreview key={collection.id} collection={collection} />
            ))}
          </Grid>
        </div>
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res, query, locale }) => {
  const session = await getSession(req, res)

  const resourceId = parseInt(query.resourceId as string)

  const resource = await invokeWithMiddleware(
    getResource,
    {
      id: resourceId,
      locale,
      excludeReported: false,
      includeOpenReports: true,
    },
    { req, res }
  )

  // Show authentication error if the current guest or user is not allowed to
  // see reported resources
  if (resource.reports.length > 0 && !session.$isAuthorized(["ADMIN"])) {
    throw new AuthorizationError("The requested content is currently unavailable.")
  }

  const paginatedCollections = await invokeWithMiddleware(
    getCollectionsForResource,
    { resourceId },
    { req, res }
  )
  const relatedResources = await invokeWithMiddleware(
    getResourcesRelated,
    { resourceId },
    { req, res }
  )

  const size = calcImageSize(resource.resolutionX, resource.resolutionY)

  const attribution = generateAttribution(resource)

  return {
    props: {
      resource,
      userId: session.userId,
      paginatedCollections,
      relatedResources,
      size,
      attribution,
    },
  }
}

const ResourcePage = (props: ServerSideProps) => (
  <main className={styles.main}>
    <Resource {...props} />
  </main>
)

ResourcePage.authenticate = false
ResourcePage.getLayout = (page) => <Layout>{page}</Layout>

export default ResourcePage
