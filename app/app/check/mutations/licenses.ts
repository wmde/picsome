import db, { Prisma, LicenseGroupValue, LicenseFeatureValue } from "db"
import logger from "integrations/license-check/libs/logger"
const coc = (s: LicenseFeatureValue) => {
  return { where: { id: s }, create: { id: s } }
}
const groups: Prisma.LicenseGroupCreateInput[] = [
  {
    id: LicenseGroupValue.CC0,
    features: {
      connectOrCreate: [
        coc(LicenseFeatureValue.Commercial),
        coc(LicenseFeatureValue.Modify),
        coc(LicenseFeatureValue.Distribute),
      ],
    },
  },
  {
    id: LicenseGroupValue.CCBY,
    features: {
      connectOrCreate: [
        coc(LicenseFeatureValue.Commercial),
        coc(LicenseFeatureValue.Modify),
        coc(LicenseFeatureValue.Distribute),
        coc(LicenseFeatureValue.NameAuthor),
      ],
    },
  },
  {
    id: LicenseGroupValue.CCBYNC,
    features: {
      connectOrCreate: [
        coc(LicenseFeatureValue.Modify),
        coc(LicenseFeatureValue.Distribute),
        coc(LicenseFeatureValue.NameAuthor),
      ],
    },
  },
  {
    id: LicenseGroupValue.CCBYNCND,
    features: {
      connectOrCreate: [coc(LicenseFeatureValue.Distribute), coc(LicenseFeatureValue.NameAuthor)],
    },
  },
  {
    id: LicenseGroupValue.CCBYNCSA,
    features: {
      connectOrCreate: [
        coc(LicenseFeatureValue.Distribute),
        coc(LicenseFeatureValue.NameAuthor),
        coc(LicenseFeatureValue.Modify),
        coc(LicenseFeatureValue.ShareAlike),
      ],
    },
  },
  {
    id: LicenseGroupValue.CCBYND,
    features: {
      connectOrCreate: [
        coc(LicenseFeatureValue.Distribute),
        coc(LicenseFeatureValue.NameAuthor),
        coc(LicenseFeatureValue.Commercial),
      ],
    },
  },
  {
    id: LicenseGroupValue.CCBYSA,
    features: {
      connectOrCreate: [
        coc(LicenseFeatureValue.Modify),
        coc(LicenseFeatureValue.Distribute),
        coc(LicenseFeatureValue.Commercial),
        coc(LicenseFeatureValue.ShareAlike),
        coc(LicenseFeatureValue.NameAuthor),
      ],
    },
  },
  {
    id: LicenseGroupValue.PD,
    features: {
      connectOrCreate: [
        coc(LicenseFeatureValue.Modify),
        coc(LicenseFeatureValue.Distribute),
        coc(LicenseFeatureValue.Commercial),
      ],
    },
  },
]
function getGroup(id: LicenseGroupValue) {
  const [v] = groups.filter((o) => o.id === id)
  if (!v) throw new Error("couldnt find group")
  return v
}
const otherLicenses = {
  "https://creativecommons.org/publicdomain/mark/1.0/": {
    wdId: "",
    title: "Public Domain",
    version: "1.0",
    variant: "mark",
    spdxCode: "CC-PD",
    canonicalUrl: "https://creativecommons.org/publicdomain/mark/1.0/",
    group: {
      connectOrCreate: {
        where: { id: LicenseGroupValue.PD },
        create: getGroup(LicenseGroupValue.PD),
      },
    },
  },
  "https://commons.wikimedia.org/wiki/Template:PD-Art-YorckProject": {
    wdId: "",
    title: "Public Domain",
    version: "",
    variant: "",
    spdxCode: "PD-Art-YorckProject",
    canonicalUrl: "https://commons.wikimedia.org/wiki/Template:PD-Art-YorckProject",
    group: {
      connectOrCreate: {
        where: { id: LicenseGroupValue.PD },
        create: getGroup(LicenseGroupValue.PD),
      },
    },
  },
  "https://commons.wikimedia.org/wiki/Template:PD-self": {
    wdId: "",
    title: "Public Domain",
    version: "",
    variant: "",
    spdxCode: "PD-self",
    canonicalUrl: "https://commons.wikimedia.org/wiki/Template:PD-self",
    group: {
      connectOrCreate: {
        where: { id: LicenseGroupValue.PD },
        create: getGroup(LicenseGroupValue.PD),
      },
    },
  },
  "https://commons.wikimedia.org/wiki/Template:PD-US": {
    wdId: "",
    title: "Public Domain",
    version: "",
    variant: "",
    spdxCode: "PD-US",
    canonicalUrl: "https://commons.wikimedia.org/wiki/Template:PD-US",
    group: {
      connectOrCreate: {
        where: { id: LicenseGroupValue.PD },
        create: getGroup(LicenseGroupValue.PD),
      },
    },
  },
  "https://commons.wikimedia.org/wiki/Template:PD-USGov": {
    wdId: "",
    title: "Public Domain",
    version: "",
    variant: "",
    spdxCode: "PD-USGov",
    canonicalUrl: "https://commons.wikimedia.org/wiki/Template:PD-USGov",
    group: {
      connectOrCreate: {
        where: { id: LicenseGroupValue.PD },
        create: getGroup(LicenseGroupValue.PD),
      },
    },
  },
  "https://commons.wikimedia.org/wiki/Template:PD-author": {
    wdId: "",
    title: "Public Domain",
    version: "",
    variant: "",
    spdxCode: "PD-author",
    canonicalUrl: "https://commons.wikimedia.org/wiki/Template:PD-author",
    group: {
      connectOrCreate: {
        where: { id: LicenseGroupValue.PD },
        create: getGroup(LicenseGroupValue.PD),
      },
    },
  },
  "https://commons.wikimedia.org/wiki/Template:PD-user": {
    wdId: "",
    title: "Public Domain",
    version: "",
    variant: "",
    spdxCode: "PD-user",
    canonicalUrl: "https://commons.wikimedia.org/wiki/Template:PD-user",
    group: {
      connectOrCreate: {
        where: { id: LicenseGroupValue.PD },
        create: getGroup(LicenseGroupValue.PD),
      },
    },
  },
  "https://commons.wikimedia.org/wiki/Template:PD-old": {
    wdId: "",
    title: "Public Domain",
    version: "",
    variant: "",
    spdxCode: "PD-old",
    canonicalUrl: "https://commons.wikimedia.org/wiki/Template:PD-old",
    group: {
      connectOrCreate: {
        where: { id: LicenseGroupValue.PD },
        create: getGroup(LicenseGroupValue.PD),
      },
    },
  },
  "https://creativecommons.org/publicdomain/zero/1.0/": {
    wdId: "",
    title: "CC0",
    version: "1.0",
    variant: "",
    spdxCode: "CC0",
    canonicalUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    group: {
      connectOrCreate: {
        where: { id: LicenseGroupValue.CC0 },
        create: getGroup(LicenseGroupValue.CC0),
      },
    },
  },
  "https://creativecommons.org/publicdomain/cc0/1.0/": {
    wdId: "",
    title: "CC0",
    version: "1.0",
    variant: "",
    spdxCode: "CC0",
    canonicalUrl: "https://creativecommons.org/publicdomain/cc0/1.0/",
    group: {
      connectOrCreate: {
        where: { id: LicenseGroupValue.CC0 },
        create: getGroup(LicenseGroupValue.CC0),
      },
    },
  },
  "https://creativecommons.org/licenses/cc0/1.0/": {
    wdId: "",
    title: "CC0",
    version: "1.0",
    variant: "",
    spdxCode: "CC0",
    canonicalUrl: "https://creativecommons.org/licenses/cc0/1.0/",
    group: {
      connectOrCreate: {
        where: { id: LicenseGroupValue.CC0 },
        create: getGroup(LicenseGroupValue.CC0),
      },
    },
  },
  "https://creativecommons.org/licenses/by-nd-nc/2.0/jp/": {
    wdId: "",
    title: "CC BY-NC-ND",
    version: "2.0",
    variant: "JP",
    spdxCode: "CC-BY-NC-ND-2.0",
    canonicalUrl: "https://creativecommons.org/licenses/by-nd-nc/2.0/jp/",
    group: {
      connectOrCreate: {
        where: { id: LicenseGroupValue.CCBYNCND },
        create: getGroup(LicenseGroupValue.CCBYNCND),
      },
    },
  },
  "http://creativecommons.org/publicdomain/zero/1.0/deed.en": {
    wdId: "",
    title: "CC0",
    version: "1.0",
    variant: "",
    spdxCode: "CC0",
    canonicalUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    group: {
      connectOrCreate: {
        where: { id: LicenseGroupValue.CC0 },
        create: getGroup(LicenseGroupValue.CC0),
      },
    },
  },
}

export default function get(url: string): Prisma.LicenseCreateInput | undefined {
  try {
    const Url = new URL(url)
    const known = otherLicenses[url]
    if (known) return known

    if (Url.hostname === "creativecommons.org") {
      let [_, group, version, variant] = Url.pathname.split("/").filter((s) => s !== "")
      const groupID = `CC${group?.split("-").join("").toUpperCase()}` as LicenseGroupValue
      const versionS = version ? version.toUpperCase() : ""
      const variantS = variant ? variant.toUpperCase() : ""

      return {
        canonicalUrl: url,
        wdId: "",
        group: { connectOrCreate: { where: { id: groupID }, create: getGroup(groupID) } },
        spdxCode: `${groupID}-${version}${variant ? "-" + variantS : ""}`,
        title: `CC ${group?.toUpperCase()} ${versionS}${variant ? " " : variantS}`,
        variant: variantS,
        version: versionS,
      }
    } else if (Url.hostname === "www.flickr.com") {
      return {
        canonicalUrl: url,
        wdId: "",
        group: { connectOrCreate: { where: { id: "CC0" }, create: getGroup("CC0") } },
        spdxCode: `CC0-1.0`,
        title: `Flickr Commons (CC0)`,
        variant: "Flickr",
        version: "1.0",
      }
    }
  } catch (e) {
    logger.error(`[license] got invalid license url ${url}`)
    return undefined
  }
}
