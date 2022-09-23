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
