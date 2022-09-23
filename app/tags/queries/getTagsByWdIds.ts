import db from "db"

export const getTagsByWdIds = async (wdIds: string[]) => {
  return await db.tag.findMany({
    distinct: ["wdId"],
    where: {
      wdId: { in: wdIds },
    },
    select: {
      label: true,
      description: true,
      wdId: true,
    },
  })
}
