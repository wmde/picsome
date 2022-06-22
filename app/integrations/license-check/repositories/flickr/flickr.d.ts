import { License } from "types"

export type FlickrAssetInfo = {
  owner: { username: string; path_alias: string }
  title: { _content: string }
  license: number
  _content: string
  urls: { url: Array<{ _content: string }> }
}

// type FlickrLicense = {
//   code: string;
//   name: string;
//   url: string;
// };

export type FlickrLicenses = {
  [key: number]: License
}
