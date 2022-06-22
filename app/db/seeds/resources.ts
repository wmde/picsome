import { ResourceCreateWithoutDetailsWithoutLicenseInput } from "app/check/mutations/createResource"
type ResourceInput = [ResourceCreateWithoutDetailsWithoutLicenseInput, string]
export const resourceInput: ResourceInput = [
  {
    title: "Stockholm August 2020 - Kastellet and Nordic Museum",
    resourceUrl:
      "https://commons.wikimedia.org/wiki/File:Stockholm_August_2020_-_Kastellet,_Vasa_Museum,_and_Nordic_Museum.jpg",
    imgUrl:
      "https://upload.wikimedia.org/wikipedia/commons/9/99/Stockholm_August_2020_-_Kastellet%2C_Vasa_Museum%2C_and_Nordic_Museum.jpg",
    thumbUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Stockholm_August_2020_-_Kastellet%2C_Vasa_Museum%2C_and_Nordic_Museum.jpg/640px-Stockholm_August_2020_-_Kastellet%2C_Vasa_Museum%2C_and_Nordic_Museum.jpg",
    resolutionX: 5264,
    resolutionY: 2859,
    sizeBytes: 13631488,
    authorName: "Martin Falbisoner",
    authorUrl: "https://commons.wikimedia.org/wiki/User:Martin_Falbisoner",
    repository: "Wikicommons",
  },
  "https://creativecommons.org/licenses/by-sa/4.0",
]

export const resourceInput2: ResourceInput = [
  {
    title:
      "File:View from Mt Fyffe, Kaikoura Ranges, New Zealand.jpg August 2020 - Kastellet and Nordic Museum",
    resourceUrl:
      "https://commons.wikimedia.org/wiki/File:View_from_Mt_Fyffe,_Kaikoura_Ranges,_New_Zealand.jpg",
    imgUrl:
      "https://upload.wikimedia.org/wikipedia/commons/6/6b/View_from_Mt_Fyffe%2C_Kaikoura_Ranges%2C_New_Zealand.jpg",
    thumbUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/View_from_Mt_Fyffe%2C_Kaikoura_Ranges%2C_New_Zealand.jpg/800px-View_from_Mt_Fyffe%2C_Kaikoura_Ranges%2C_New_Zealand.jpg",
    resolutionX: 7025,
    resolutionY: 2962,
    sizeBytes: 13650000,
    authorName: "Michal Klajban",
    authorUrl: "https://commons.wikimedia.org/wiki/User:Podzemnik",
    repository: "Wikicommons",
  },
  "https://creativecommons.org/licenses/by-sa/4.0",
]
export const resourceInput3: ResourceInput = [
  {
    title: "File:Stockholms_Stadshuset_City_Hall_Stockholm_2016_01",
    resourceUrl:
      "https://commons.wikimedia.org/wiki/File:Stockholms_Stadshuset_City_Hall_Stockholm_2016_01.jpg",
    imgUrl:
      "https://upload.wikimedia.org/wikipedia/commons/1/14/Stockholms_Stadshuset_City_Hall_Stockholm_2016_01.jpg",
    thumbUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Stockholms_Stadshuset_City_Hall_Stockholm_2016_01.jpg/320px-Stockholms_Stadshuset_City_Hall_Stockholm_2016_01.jpg",
    resolutionY: 2762,
    resolutionX: 4906,
    sizeBytes: 46650000,
    authorName: "Julian Herzog",
    authorUrl: "https://commons.wikimedia.org/wiki/User:Julian_Herzog",
    repository: "Wikicommons",
  },
  "https://creativecommons.org/licenses/by-sa/4.0",
]

export const resources: ResourceInput[] = [
  [
    {
      title: "BY-NC-SA",
      resourceUrl:
        "https://commons.wikimedorg/wiki/File:View_from_Mt_Fyffe,_Kaikoura_Ranges,_New_Zeald.jpg",
      imgUrl:
        "https://upload.wikimedia.org/wikipedia/commons/6/6b/View_from_Mt_Fyffe%2C_Kaikoura_Ranges%2C_New_Zealand.jpg",
      thumbUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/View_from_Mt_Fyffe%2C_Kaikoura_Ranges%2C_New_Zealand.jpg/800px-View_from_Mt_Fyffe%2C_Kaikoura_Ranges%2C_New_Zealand.jpg",
      resolutionY: 7025,
      resolutionX: 2962,
      sizeBytes: 13650000,
      authorName: "Michal Klajban",
      authorUrl: "https://commons.wikimedia.org/wiki/User:Podzemnik",
      repository: "Wikicommons",
    },
    "https://creativecommons.org/licenses/by-nc-sa/2.0/",
  ],
  [
    {
      title: "BY-NC",
      resourceUrl:
        "https://commons.wikimedia.org/wiki/File:View_from_Mt_Fyffe,_oura_Ranges,_New_Zealand.jpg",
      imgUrl:
        "https://upload.wikimedia.org/wikipedia/commons/6/6b/View_from_Mt_Fyffe%2C_Kaikoura_Ranges%2C_New_Zealand.jpg",
      thumbUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/View_from_Mt_Fyffe%2C_Kaikoura_Ranges%2C_New_Zealand.jpg/800px-View_from_Mt_Fyffe%2C_Kaikoura_Ranges%2C_New_Zealand.jpg",
      resolutionY: 7025,
      resolutionX: 2962,
      sizeBytes: 13650000,
      authorName: "Michal Klajban",
      authorUrl: "https://commons.wikimedia.org/wiki/User:Podzemnik",
      repository: "Wikicommons",
    },
    "https://creativecommons.org/licenses/by-nc/2.0/",
  ],
  [
    {
      title: "BY-NC-ND",
      resourceUrl:
        "https://comns.wikimedia.org/wiki/File:View_from_Mt_Fyffe,_Koura_Ranges,_New_Zealand.jpg",
      imgUrl:
        "https://upload.wikimedia.org/wikipedia/commons/6/6b/View_from_Mt_Fyffe%2C_Kaikoura_Ranges%2C_New_Zealand.gif",
      thumbUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/View_from_Mt_Fyffe%2C_Kaikoura_Ranges%2C_New_Zealand.jpg/800px-View_from_Mt_Fyffe%2C_Kaikoura_Ranges%2C_New_Zealand.jpg",
      resolutionY: 7025,
      resolutionX: 2962,
      sizeBytes: 13650000,
      authorName: "Michal Klajban",
      authorUrl: "https://commons.wikimedia.org/wiki/User:Podzemnik",
      repository: "Wikicommons",
    },
    "https://creativecommons.org/licenses/by-nc-nd/2.0/",
  ],
  [
    {
      title: "BY-SA",
      resourceUrl:
        "https://mmons.wikimedia.org/wiki/File:View_fm_Mt_Fyffe,_Kaikoura_Rges,_New_Zealand.jpg",
      imgUrl:
        "https://upload.wikimedia.org/wikipedia/commons/6/6b/View_from_Mt_Fyffe%2C_Kaikoura_Ranges%2C_New_Zealand.jpg",
      thumbUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/View_from_Mt_Fyffe%2C_Kaikoura_Ranges%2C_New_Zealand.jpg/800px-View_from_Mt_Fyffe%2C_Kaikoura_Ranges%2C_New_Zealand.jpg",
      resolutionY: 7025,
      resolutionX: 2962,
      sizeBytes: 13650000,
      authorName: "Michal Klajban",
      authorUrl: "https://commons.wikimedia.org/wiki/User:Podzemnik",
      repository: "Wikicommons",
    },
    "https://creativecommons.org/licenses/by-sa/2.0/",
  ],
  [
    {
      title: "BY-ND",
      resourceUrl:
        "https://commons.wikimedia.iki/File:View_from_Mtyffe,_Kaikoura_Ranges,_New_Zealand.jpg",
      imgUrl:
        "https://upload.wikimedia.org/wikipedia/commons/6/6b/View_from_Mt_Fyffe%2C_Kaikoura_Ranges%2C_New_Zealand.jpg",
      thumbUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/View_from_Mt_Fyffe%2C_Kaikoura_Ranges%2C_New_Zealand.jpg/800px-View_from_Mt_Fyffe%2C_Kaikoura_Ranges%2C_New_Zealand.jpg",
      resolutionY: 1500,
      resolutionX: 1000,
      sizeBytes: 13650000,
      authorName: "Michal Klajban",
      authorUrl: "https://commons.wikimedia.org/wiki/User:Podzemnik",
      repository: "Wikicommons",
    },
    "https://creativecommons.org/licenses/by-nd/2.0/",
  ],
  [
    {
      title: "CC-0",
      resourceUrl:
        "https://commons.wikimedia.org/ki/File:View_fr_Mtfe,_Kaikoura_Ranges,_New_Zealand.jpg",
      imgUrl:
        "https://upload.wikimedia.org/wikipedia/commons/6/6b/View_from_Mt_Fyffe%2C_Kaikoura_Ranges%2C_New_Zealand.jpg",
      thumbUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/View_from_Mt_Fyffe%2C_Kaikoura_Ranges%2C_New_Zealand.jpg/800px-View_from_Mt_Fyffe%2C_Kaikoura_Ranges%2C_New_Zealand.jpg",
      resolutionY: 50,
      resolutionX: 50,
      sizeBytes: 13650000,
      authorName: "Michal Klajban",
      authorUrl: "https://commons.wikimedia.org/wiki/User:Podzemnik",
      repository: "Wikicommons",
    },
    "https://creativecommons.org/publicdomain/zero/1.0/",
  ],
]
