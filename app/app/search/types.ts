import { LicenseFeature, LicenseGroup, LicenseGroupValue } from "@prisma/client"

export type FilterElem<V, E> = { v: V; selected: boolean; usable: boolean; extra?: E }
export type Filter<V, E> = Array<FilterElem<V, E>>

export type Group = LicenseGroup & { features: LicenseFeature[] }
export type GroupFilter = Filter<LicenseGroupValue, Group>
