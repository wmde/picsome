import config from "../../config/repositories"
import logger from "integrations/license-check/libs/logger"
import { AuthorAndLicense } from "integrations/license-check/types"
import { decode as decodeHtmlEntities } from "html-entities"
import { fetchJsonData } from "integrations/license-check/libs/utils"
import { z } from "zod"

const attributionGeneratorFileInfoSchema = z.object({
  license: z.object({ code: z.string(), name: z.string(), url: z.string() }),
  authorHtml: z.string().nullable(),
})

export const getAuthorAndLicenseFromAttributionGeneratorApi = async (
  descriptionurl: string
): Promise<Partial<AuthorAndLicense> | undefined> => {
  // extract title from descriptionurl

  let canonicaltitle = ""
  const parsedUrl = new URL(descriptionurl)

  if (parsedUrl.searchParams.has("title")) {
    canonicaltitle = parsedUrl.searchParams.get("title") as string
  } else if (parsedUrl.pathname.startsWith("/wiki/")) {
    canonicaltitle = decodeURI(parsedUrl.pathname.substring("/wiki/".length))
  }

  const url = `${config.wiki}/fileinfo/${encodeURI(canonicaltitle)}`
  const responseData = await fetchJsonData(url)

  try {
    const { license, authorHtml } = attributionGeneratorFileInfoSchema.parse(responseData)
    const author = authorHtml !== null ? parseAuthorFromAuthorHtml(authorHtml) : undefined
    return {
      authorName: author?.authorName,
      authorUrl: author?.authorUrl,
      licenseUrl: license.url.replace("legalcode", ""),
    }
  } catch (error) {
    logger.error(
      `Received unexpected response from the Attribution Generator API: ${error.message}`
    )
    return undefined
  }
}

/**
 * We expect HTML or plain text values as input of this function and try to deal
 * with it with string manipulation.
 * TODO: authorUrl is optional, remove empty string as a workaround
 */
const parseAuthorFromAuthorHtml = (
  authorHtml: string
):
  | {
      authorName: string
      authorUrl: string
    }
  | undefined => {
  // Match the innermost text content
  const authorName = authorHtml.replaceAll(/\r?\n+/g, "").match(/>([^>^<]+)</)?.[1] ?? authorHtml
  let authorUrl = authorHtml.match(/href=\"([^"]*)"/)?.[1] ?? undefined

  if (authorName === undefined) {
    return undefined
  }

  // The urls sometimes start with '//', not the protocol, we clean up both just to be sure
  if (
    authorUrl !== undefined &&
    authorUrl !== "" &&
    authorUrl.indexOf("https://") !== 0 &&
    authorUrl.indexOf("http://") !== 0
  ) {
    authorUrl = "https://" + authorUrl.replace(/^\/[\/]+/, "")
  }

  return {
    authorName: decodeHtmlEntities(authorName),
    authorUrl: authorUrl ?? "",
  }
}
