import logger from "integrations/license-check/libs/logger"
import { z } from "zod"

export const wikidataItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
})
const WikidataErrorResponse = z.object({
  errors: z.array(z.any()),
})
const WikidataSuccessResponse = z.object({
  search: z.array(wikidataItemSchema),
  // "search-continue": z.number(), can also be undefined
  success: z.number(),
})

// const WikiApiUrl = new URL("https://www.wikidata.org/w/api.php")

const WikidataResponse = WikidataErrorResponse.or(WikidataSuccessResponse)

export type WikidataItem = z.infer<typeof wikidataItemSchema>

export type WikidataFetchParams = {
  language: string
  search: string
}

export const fetchSuggestions = async (
  data: WikidataFetchParams
): Promise<[WikidataItem[], any]> => {
  const { search, language } = data

  let langCode = language === "de_DE" ? "de" : language

  if (search === "") {
    // our request would fail without a search result, but to make things easier we just return nothin
    return [[], undefined]
  }
  // both should be set to user locale
  // on the backend when we create a tag we should do a separate request to wbgetentities to get all other languages
  // so we only send the id back to the backend
  //https://www.wikidata.org/w/api.php?action=help&modules=wbgetentities
  // Type: boolean (details)

  // CORS Request ahead:
  // See Documentation:
  // https://www.mediawiki.org/wiki/API:Cross-site_requests
  // Wikidata needs 'origin' to be set as a query arg (here set to '*')
  // It ignores the http header, we include it anyways to be good citizens
  //const url = new URL("https://www.wikidata.org/w/api.php")
  const WikiApiUrl = new URL("https://www.wikidata.org/w/api.php")
  const params = new URLSearchParams(
    "action=wbsearchentities&format=json&errorformat=plaintext&type=item"
  )
  params.set("search", search)

  params.set("origin", "*")

  params.set("language", langCode)
  params.set("uselang", langCode)

  WikiApiUrl.search = params.toString()

  const res = await fetch(WikiApiUrl.href, {
    headers: {
      "Content-Type": "application/json",
      Origin: "*",
    },
  })

  if (res.ok) {
    try {
      const body = await res.json()
      //console.log(body)
      const result = WikidataResponse.parse(body)
      if ("success" in result) {
        return [result.search, undefined]
      } else {
        return [[], result]
      }
    } catch (e) {
      return [[], res]
    }
  }

  return [[], res]
}

export type WikidataDetailsParams = {
  wdId: string
  language: string
}

export const getLocalLabelForWikidataItem = async (
  data: WikidataDetailsParams
): Promise<WikidataItem> => {
  const { wdId, language } = data
  const entity = await getDetailsForWikidataItem(wdId)
  if (typeof entity === "string") {
    return { id: wdId, label: "", description: "" }
  }
  try {
    const label = entity.labels[language].value
    const description = entity.descriptions[language].value
    return { id: wdId, label, description }
  } catch (e) {
    logger.error("didnt get entity labels", wdId, e)
    return { id: wdId, label: "" }
  }
}

export const getDetailsForWikidataItem = async (wdId: string) => {
  if (wdId === "") {
    // our request would fail without a search result, but to make things easier we just return nothin
    return "no id provided"
  }
  // CORS Request ahead:
  // See Documentation:
  // https://www.mediawiki.org/wiki/API:Cross-site_requests
  // Wikidata needs 'origin' to be set as a query arg (here set to '*')
  // It ignores the http header, we include it anyways to be good citizens
  //const url = new URL("https://www.wikidata.org/w/api.php")
  const WikiApiUrl = new URL("https://www.wikidata.org/w/api.php")
  WikiApiUrl.searchParams.set("action", "wbgetentities")
  WikiApiUrl.searchParams.set("format", "json")
  WikiApiUrl.searchParams.set("errorformat", "plaintext")
  WikiApiUrl.searchParams.set("ids", wdId)
  WikiApiUrl.searchParams.set("origin", "*")
  const res = await fetch(WikiApiUrl.href, {
    headers: {
      "Content-Type": "application/json",
      Origin: "*",
    },
  })

  if (res.ok) {
    try {
      const result = await res.json()

      if ("success" in result) {
        return result.entities[wdId]
      } else {
        logger.error("wikidata request failed ", result)
        return ""
      }
    } catch (e) {
      logger.error("wikidata request failed", e)
      return ""
    }
  }

  logger.error("wikidata request failed ", res.status, res.statusText)
  return ""
}
