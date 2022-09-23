import { useT } from "@transifex/react"
import { LicensedAndTaggedResource } from "app/resources/queries/getResources"

export type Attribution = {
  plaintext: string
  html: string
}

const useAttribution = (resource: LicensedAndTaggedResource): Attribution => {
  const authorPlaceholder = useT("Urheber*in hier einsetzen")

  const { title, resourceUrl, authorName, authorUrl, license } = resource

  const author = authorName !== "" ? authorName : `[${authorPlaceholder}]`

  let plaintext = `${author}${authorUrl && ` (${authorUrl})`}, "${title}" (${decodeURIComponent(
    resourceUrl
  )}), ${license.title} ${license.canonicalUrl ? `(${license.canonicalUrl})` : ``}`

  let html = `${
    authorUrl
      ? `<a target="_blank" rel="noopener" href="${authorUrl}">${author}</a>,`
      : `${author}, `
  } <a target="_blank" rel="noopener" href="${decodeURIComponent(resourceUrl)}">${title}</a>, ${
    license.canonicalUrl ? `<a target="_blank" rel="noopener" href="${license.canonicalUrl}">` : ``
  }${license.title}${license.canonicalUrl ? `</a>` : ``}`

  html = html.replace(/[\n\r]+/g, " ")
  plaintext = plaintext.replace(/[\n\r]+/g, " ")

  return {
    plaintext,
    html,
  }
}

export default useAttribution
