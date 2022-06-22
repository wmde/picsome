import { fetchResults, search, mapResults } from "./search"
describe("CC Search", () => {
  // test.skip("Simple search", async () => {
  // const res = await fetchResults("banana")
  // console.log(JSON.stringify(res, null, 2))
  // })

  test("", async () => {
    const a = [
      {
        title: "Banana",
        id: "96b8ba17-de4c-465d-b6b5-31f214c4bbb6",
        creator: "viZZZual.com",
        creator_url: "https://www.flickr.com/photos/22394551@N03",
        tags: [
          {
            name: "banana",
          },
          {
            name: "bananae",
          },
          {
            name: "carbohydrate",
          },
          {
            name: "carbohydrates",
          },
          {
            name: "carbos",
          },
          {
            name: "delicious",
          },
          {
            name: "food",
          },
          {
            name: "health",
          },
          {
            name: "still life",
          },
          {
            name: "wood",
          },
        ],
        url: "https://live.staticflickr.com/2028/2258149132_7cdeabce73.jpg",
        thumbnail:
          "https://api.openverse.engineering/v1/thumbs/96b8ba17-de4c-465d-b6b5-31f214c4bbb6",
        provider: "flickr",
        source: "flickr",
        license: "by",
        license_version: "2.0",
        license_url: "https://creativecommons.org/licenses/by/2.0/",
        foreign_landing_url: "https://www.flickr.com/photos/22394551@N03/2258149132",
        detail_url:
          "https://api.openverse.engineering/v1/images/96b8ba17-de4c-465d-b6b5-31f214c4bbb6",
        related_url:
          "https://api.openverse.engineering/v1/recommendations/images/96b8ba17-de4c-465d-b6b5-31f214c4bbb6",
        fields_matched: ["description", "tags.name", "title"],
      },
      {
        title: "aussieBum Banana Brf White",
        id: "f2d8a8a5-b27d-42e2-9542-f1d91c6e0846",
        creator: "Enrique_L.",
        creator_url: "https://www.flickr.com/photos/38228919@N07",
        tags: [
          {
            name: "aussiebum",
          },
          {
            name: "banana",
          },
          {
            name: "menunderwear",
          },
          {
            name: "musclehunk",
          },
          {
            name: "naked",
          },
          {
            name: "underwear",
          },
        ],
        url: "https://live.staticflickr.com/8247/8513396196_515ac4e945_b.jpg",
        thumbnail:
          "https://api.creativecommons.engineering/v1/thumbs/f2d8a8a5-b27d-42e2-9542-f1d91c6e0846",
        provider: "flickr",
        source: "flickr",
        license: "by-nc",
        license_version: "2.0",
        license_url: "https://creativecommons.org/licenses/by-nc/2.0/",
        foreign_landing_url: "https://www.flickr.com/photos/38228919@N07/8513396196",
        detail_url:
          "https://api.openverse.engineering/v1/images/f2d8a8a5-b27d-42e2-9542-f1d91c6e0846",
        related_url:
          "https://api.openverse.engineering/v1/recommendations/images/f2d8a8a5-b27d-42e2-9542-f1d91c6e0846",
        fields_matched: ["description", "tags.name", "title"],
      },
    ]
    await mapResults(a)
  })
  // test.only("secretmanager", async () => {
  //   const t = await secretManager.getToken()
  //   expect(t).toBeTruthy()
  // })
})
