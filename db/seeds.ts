import createResourcesForUrl from "app/check/mutations/createResourcesForUrl"
import db from "./index"
import { Ctx } from "blitz"

const resourceUrls = [
  "https://commons.wikimedia.org/wiki/File:Oak_Ridge_Tokamak_%2849742533888%29.png",
  "https://commons.wikimedia.org/wiki/File:Extended_logarithmic_universe_illustration.png",
  "https://commons.wikimedia.org/wiki/File:Is_Open.jpg",
  "https://commons.wikimedia.org/wiki/File:Taylor_column.jpg",
  "https://commons.wikimedia.org/wiki/File:Caryocrinites_models.jpg",
  "https://commons.wikimedia.org/wiki/File:Schnecke_Elba.jpg",
  "https://commons.wikimedia.org/wiki/File:Superf%C3%ADcie_-_hiperboloide_de_uma_folha_02.jpg",
  "https://commons.wikimedia.org/wiki/File:Abstract-3_%282692469267%29.jpg",
  "https://commons.wikimedia.org/wiki/File:%D0%9A%D1%80%D0%B8%D1%88%D1%82%D0%B0%D0%BB%D0%B5%D0%B2%D1%96_%D0%BA%D1%80%D0%B8%D0%BB%D0%B0.jpg",
  "https://commons.wikimedia.org/wiki/File:Paraboloide_circular_01.jpg",
]

const seed = async () => {
  const userEmail = "picsome@wikimedia.de"
  const userName = "Team picsome"
  const userRole = "ADMIN"
  const user = await db.user.create({
    data: {
      email: userEmail,
      name: userName,
      role: userRole,
    },
  })
  const featuredCollection = await db.collection.create({
    data: {
      title: "✨ Featured Images",
      user: {
        connect: { id: user.id },
      },
    },
  })
  for (const resourceUrl of resourceUrls) {
    const resources = await createResourcesForUrl({ resourceUrl }, {} as Ctx)
    for (const resource of resources) {
      await db.collectionItem.create({
        data: {
          userId: user.id,
          resourceId: resource.id,
          collectionId: featuredCollection.id,
        },
      })
    }
  }
}

export default seed
