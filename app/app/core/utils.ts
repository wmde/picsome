export type Attribution = {
  plaintext: string
  html: string
}

export function generateAttribution(asset: any): Attribution {
  const { title, resourceUrl, authorName, authorUrl, license } = asset

  let plaintext = `${authorName}${authorUrl && ` (${authorUrl})`}, "${title}" (${decodeURIComponent(
    resourceUrl
  )}), ${license.title} ${license.canonicalUrl ? `(${license.canonicalUrl})` : ``}`

  let html = `${
    authorUrl ? `<a target="_blank" href="${authorUrl}">${authorName}</a>,` : `${authorName}, `
  } <a target="_blank" href="${decodeURIComponent(resourceUrl)}">${title}</a>, ${
    license.canonicalUrl ? `<a target="_blank" href="${license.canonicalUrl}">` : ``
  }${license.title}${license.canonicalUrl ? `</a>` : ``}`

  html = html.replace(/[\n\r]+/g, " ")
  plaintext = plaintext.replace(/[\n\r]+/g, " ")

  return {
    plaintext,
    html,
  }
}
