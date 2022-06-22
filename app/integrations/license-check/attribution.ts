import logger from "./libs/logger"
import { LicenseInfo } from "./types/index"

export type Attribution = {
  plaintext: string
  html: string
}

export type Author = {
  name: string
  url: string
  html?: string
}

export type PartialAssetInfo = Partial<AssetInfo>
export type AssetInfo = {
  title: string
  author: Author
  source: string
  licenseS: string
  licenseUrl?: string
  licenseVersion?: string
  license: LicenseInfo
}

export function generateAttribution(asset: AssetInfo): Attribution {
  const { title, author, source, license, licenseUrl, licenseVersion } = asset

  const plaintext = `"${title}", (${source}) by ${author.name} (${
    author.url
  }) is licensed under ${license}${licenseVersion ? ` ${licenseVersion}` : ``} ${
    licenseUrl ? `(${licenseUrl})` : ``
  }`

  const html = `'<a href="${source}">${title}</a>', by <a href="${author.url}">${
    author.name
  }</a> is licensed under ${licenseUrl ? `<a href="${licenseUrl}">` : ``}${license}${
    licenseVersion ? ` ${licenseVersion}` : ``
  }${licenseUrl ? `</a>` : ``}`

  return {
    plaintext,
    html,
  }
}

export function generateAuthorHtml(author: Author): string {
  logger.log(`generate authorHtml for ${author.name}`)
  return ""
}
