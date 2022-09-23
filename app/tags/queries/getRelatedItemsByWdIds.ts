import { WikidataItem } from "app/core/services/wikidata"
import db from "db"

const getRelatedItemsByWdIds = async (wdIds: string[]): Promise<WikidataItem[]> => {
  const tags = await db.tag.findMany({
    distinct: ["wdId"],
    where: {
      wdId: { notIn: wdIds },
      resource: {
        items: {
          some: {
            collection: {
              AND: wdIds.map((wdId) => ({
                items: {
                  some: {
                    resource: {
                      tags: {
                        some: { wdId },
                      },
                    },
                  },
                },
              })),
            },
          },
        },
      },
    },
    select: {
      label: true,
      description: true,
      wdId: true,
    },
  })
  return tags.map((tag) => ({
    id: tag.wdId,
    label: tag.label,
    description: tag.description,
  }))
}

export default getRelatedItemsByWdIds
