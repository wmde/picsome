import repo, { getFileInfo } from "../repositories/flickr"

test.skip("can get fileInfo for ID", async () => {
  const response = await getFileInfo("25825763")
  expect(response.stat).toBe("ok")
  expect(response.photo.license).toBe("1")
})
test.skip("can get assetinfo  for ID", async () => {
  const [response] = await repo.getResourceDraftsForUrl("25825763", 1)
  expect(response).toBe(true)
})
