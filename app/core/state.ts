import { LicenseFeatureValue } from "db"
import { atom } from "jotai"
import { WikidataItem } from "./services/wikidata"

export const searchAtom = atom<WikidataItem[]>([])
export const searchLicenseFeatureAtom = atom<LicenseFeatureValue[]>([])

export const scrollAtom = atom(0)
