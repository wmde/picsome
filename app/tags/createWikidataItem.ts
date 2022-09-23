import db from "db"
import { WikidataItemLabelData } from "./types"

export async function createWikidataItem(wdId: string, labels: WikidataItemLabelData[]) {
  const connectOrCreate = labels.map(({ locale, label, description }) => {
    return { where: { wdId_locale: { locale, wdId } }, create: { label, locale, description } }
  })
  await db.wikidataItem.create({
    data: {
      wdId,
      labels: {
        connectOrCreate,
      },
    },
  })
}
