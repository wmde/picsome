import { ResourceDraft } from "app/check/mutations/createResource"

export type Repository = {
  name: string
  /**
   * Compose a resource draft for the given resource url
   */
  getResourceDraft: (resourceUrl: string) => Promise<ResourceDraft | undefined>

  /**
   * Fetch multiple resource drafts for the given url
   */
  getResourceDraftsForUrl: (url: string, limit?: number) => Promise<ResourceDraft[]>

  /**
   * Fetch multiple resource previews for the given url
   */
  getResourcePreviewsForUrl: (url: string, limit?: number) => Promise<ResourcePreview[]>
}

export type ResourcePreview = {
  title: string
  resourceUrl: string
  imageUrl: string
}

export enum Repositories {
  flickr = "flickr",
  wiki = "wiki",
}

export type LicenseResult =
  | {
      kind: "error"
    }
  | {
      kind: "license"
      license: LicenseInfo
    }

export type LicenseInfo = {
  code: string
  name: string
  url: string
  groups?: Array<string>
}

export type AuthorAndLicense = {
  authorName: string
  authorUrl: string
  licenseUrl: string
}
