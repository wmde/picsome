import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import fetch from "node-fetch"
import path from "path"
import fs from "fs"
import authenticateApiJobRequest from "app/auth/authenticate-api-job"

/**
 * Link to a text file containing NSIDs of Flickr authors on each line that
 * uploaded 'questionable Flickr images' in the past.
 * See https://commons.wikimedia.org/wiki/Commons:Questionable_Flickr_images
 */
const badFlickrAuthorsUrl =
  "https://commons.wikimedia.org/w/index.php?title=User:FlickreviewR/bad-authors&action=raw"

/** Local path to the JSON file bad author NSIDs are stored in */
const badFlickrAuthorsJsonPath = path.resolve("data/bad-flickr-authors.json")

export default async function refreshBadFlickrAuthors(req: BlitzApiRequest, res: BlitzApiResponse) {
  // Authenticate
  await authenticateApiJobRequest(req, res)

  // Fetch Bad Flickr authors from Wikimedia Commons
  let text: string
  try {
    // TODO: Add user agent to let Wikimedia know what application is fetching this resource
    const response = await fetch(badFlickrAuthorsUrl, {
      method: "GET",
    })
    if (!response.ok) {
      res.status(500)
      res.json({
        success: false,
        error: `Received unexpected status code ${response.status} fetching the bad authors list`,
      })
      return
    }
    text = await response.text()
  } catch (error) {
    res.status(500)
    res.json({
      success: false,
      error: `Unexpected error while fetching the bad authors list`,
    })
    return
  }

  // Parse text file to array of Flickr NSIDs
  const badAuthorIds = Array.from(text.matchAll(/([0-9]+@N[0-9]+)/g)).map((match) => match[1])

  // Store into JSON file
  fs.writeFileSync(badFlickrAuthorsJsonPath, JSON.stringify(badAuthorIds))

  // Success
  res.status(200)
  res.json({ success: true, error: null })
}
