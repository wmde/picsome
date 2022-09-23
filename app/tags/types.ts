import { WikidataItemLabel, Tag, WikidataItem } from "db"

type OmitDbFields = "id" | "updatedAt" | "createdAt" | "wdId"
export type WikidataItemLabelData = Omit<WikidataItemLabel, OmitDbFields>

export type TagFull = Omit<Tag, OmitDbFields> & {
  wikidataItem?: WikidataItem & { labels: WikidataItemLabel[] }
}
