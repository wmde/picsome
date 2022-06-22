import fetch, { RequestInit, Response } from "node-fetch"
import error from "./error"

export type RequestOptions = RequestInit

// improve upon std fetch
export default async function request(url: string, options?: RequestOptions) {
  const resp = await fetch(url, options)
  if (!resp.ok) {
    throw error({ message: await resp.text(), status: resp.status })
  }
  return isJSONResponse(resp) ? resp.json() : resp.text()
}

// check that response tyoe is JSON
function isJSONResponse(resp: Response) {
  const contentType = resp.headers.get("content-type")
  return contentType && contentType.includes("application/json")
}
