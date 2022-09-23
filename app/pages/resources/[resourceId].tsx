import React, { ReactNode, Suspense, useState } from "react"
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
} from "app/core/components/Icons"
import CollectionPreview from "app/core/components/CollectionPreview"
import Error from "app/core/components/Error"
import PrivilegedCollectModal from "app/core/components/PrivilegedCollectModal"
import ReactTooltip from "react-tooltip"
import ReportButton from "app/reports/components/ReportButton"
import ReportLog from "app/reports/components/ReportLog"
import ResourcePreview from "app/core/components/ResourcePreview"
import Row from "app/core/components/Row"
import getCollections from "app/collections/queries/getCollections"
import getIsResourceFeatured from "app/resources/queries/getIsResourceFeatured"
import getItemReports from "app/reports/queries/getItemReports"
import getLicenseFeatures from "app/licenses/queries/getLicenseFeatures"
import getResourcesRelated from "app/resources/queries/getResourcesRelated"
import { Resource as ResourceType, LicenseFeature, LicenseFeatureValue } from "db"
import { ResourceImage } from "app/core/components/ResourceImage"
import { ResourceTags } from "app/core/components/ResourceTags"
import { T, useT } from "@transifex/react"
import { hiddenItemReportStatuses } from "app/reports/shared"
import useAttribution from "app/licenses/hooks/useAttribution"

type FeaturePresentation = [ReactNode | undefined, ReactNode | undefined]

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

  const pres = { a: new Array<ReactNode>(), b: new Array<ReactNode>() }

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
    <button className="button button--secondary" onClick={copyCodeToClipboard}>
      <T _str="Kopieren" />
    </button>
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
  const {
    resource,
    isHidden,
    isAuthorizedToRuleReports,
    reports,
    licenseFeatures,
    userId,
    paginatedCollections,
    relatedResources,
    featured,
  } = props

  const features = featurePresentation(licenseFeatures)

  const untitledTitle = useT("Ohne Titel")
  const resourceTitle = resource.title !== "" ? resource.title : untitledTitle

  const attribution = useAttribution(resource)

  return (
    <>
      <Head>
        <title>{`${resourceTitle} | picsome`}</title>
      </Head>

      <Grid>
        <div className={styles.row}>
          <BackButton>
            <T _str="Zurück" />
          </BackButton>
        </div>

        {isHidden && (
          <Row>
            <Error
              text={
                <T _str="Dieser Inhalt ist aufgrund einer offenen Meldung oder einer Entscheidung gesperrt." />
              }
            />
          </Row>
        )}

        <div className={styles.intro}>
          <h1 className={styles.headline}>
            <span className={styles.headlineInner}>{resourceTitle}</span>
          </h1>
          <div className={styles.action__container}>
            {featured === false && <ReportButton resourceId={resource.id} />}
            <CollectButton resource={resource} />
          </div>
        </div>

        <div className={styles.left}>
          <div className={styles.image__container}>
            <ResourceImage resource={resource} sizes="640px" layout="fill" objectFit="contain" />
          </div>
        </div>

        <div className={styles.right}>
          {resource.authorName !== "" && (
            <>
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
            </>
          )}
          {resource.authorName === "" && (
            <div className={styles.info}>
              <Author />
              <span>
                <T _str="Urheber*in nicht bekannt" />
              </span>
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

          <Link href={resource.license.canonicalUrl}>
            <a target="_blank" className={styles.info}>
              <CCLicense />
              <span>{resource.license.title}</span>
            </a>
          </Link>

          {resource.resolutionX !== 0 && resource.resolutionY !== 0 && (
            <div className={styles.size}>
              <ImageIcon />
              <span>{resource.resolutionX}</span>
              <span>×</span>
              <span>{resource.resolutionY}</span>
            </div>
          )}

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

          <div className={styles["license-notice"]}>
            <strong>
              <T _str="Lizenzhinweis*" />
            </strong>

            {resource.authorName === "" && (
              <div className={styles.unknownAuthorNotice}>
                <T _str="Wir konnten den/die Urheber*in dieses Bildes leider nicht automatisch ermitteln. Bitte setze diese Information manuell in den Lizenzhinweis ein, bevor du ihn verwendest." />
              </div>
            )}

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
          <ResourceTags userId={userId} resourceId={resource.id} featured={featured} />
        </Suspense>
      </Grid>

      {relatedResources.items.length > 0 && (
        <div className={styles.related}>
          <Grid>
            <Row>
              <h2>
                <T _str="Weitere Bilder mit ähnlichen Tags" n={relatedResources.items.length} />
              </h2>
            </Row>
          </Grid>
          <Grid modifier="gap">
            {relatedResources.items.map((resource) => (
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

      {reports.length > 0 && (
        <div className={styles.related}>
          <Grid modifier="gap">
            <Row>
              <h2 className={styles.related__headline}>
                <T _str="Meldungen zu diesem Inhalt" />
              </h2>
            </Row>
          </Grid>
          <Grid modifier="gap">
            <Row>
              <ReportLog reports={reports} showRulingForm={isAuthorizedToRuleReports} />
            </Row>
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
      filterVisible: false,
    },
    { req, res }
  )

  const licenseFeatures = await invokeWithMiddleware(
    getLicenseFeatures,
    { licenseId: resource.licenseId },
    { req, res }
  )

  const reports = await invokeWithMiddleware(
    getItemReports,
    {
      resourceId,
    },
    { req, res }
  )

  const isHidden =
    undefined !== reports.find((report) => hiddenItemReportStatuses.includes(report.status))
  const isAuthorizedToRuleReports = session.$isAuthorized(["ADMIN"])

  if (isHidden && !isAuthorizedToRuleReports) {
    throw new AuthorizationError("The requested content is currently unavailable.")
  }

  const paginatedCollections = await invokeWithMiddleware(
    getCollections,
    { where: { items: { some: { resourceId } } } },
    { req, res }
  )
  const relatedResources = await invokeWithMiddleware(
    getResourcesRelated,
    { resourceId },
    { req, res }
  )

  const featured = await invokeWithMiddleware(
    getIsResourceFeatured,
    { id: resourceId },
    { req, res }
  )

  const size = calcImageSize(resource.resolutionX, resource.resolutionY)

  return {
    props: {
      resource,
      isHidden,
      isAuthorizedToRuleReports,
      reports,
      licenseFeatures,
      userId: session.userId,
      paginatedCollections,
      relatedResources,
      size,
      featured,
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
