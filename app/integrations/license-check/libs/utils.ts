import logger, { loghttpErr } from "./logger"
import fetch from "node-fetch"
import https from "https"
import http from "http"
const httpsAgent = new https.Agent({ keepAlive: true })
const httpAgent = new http.Agent({
  keepAlive: true,
})

export async function fetchAgent(url: string | URL, auth?: string, accept?: string) {
  logger.info("[fetch] start ", url)
  const start = performance.now()
  const headers = {
    "user-agent":
      "picsomeFetcher/0.1 (https://www.wikimedia.de/projects/picsome/; picsome@wikimedia.de)",
  }
  if (auth) {
    headers["Authorization"] = auth
  }
  if (accept) {
    headers["Accept"] = accept
  }
  const res = await fetch(url, {
    headers,
    agent: (_parsedURL) => (_parsedURL.protocol == "http:" ? httpAgent : httpsAgent),
  })
  const end = performance.now()
  logger.info(`[fetch] end (${end - start}ms)`, url)
  return res
}

export const fetchJsonData = async (url: string | undefined): Promise<any | undefined> => {
  if (url === undefined) {
    return undefined
  }
  const response = await fetchAgent(url, undefined, "application/json")
  if (!response.ok) {
    loghttpErr(response)
    return undefined
  }
  try {
    const responseData = await response.json()
    return responseData
  } catch (error) {
    logger.error(error)
    return undefined
  }
}

export function isDefined<T>(v: T | undefined): v is T {
  return v !== undefined
}

export function isNull(v: unknown): v is null {
  return v === null
}

export function isUndefined(v: unknown): v is undefined {
  return v === undefined
}

export function isUrl(v: string): boolean {
  try {
    return toString.call(v) === "[object String]" && !!new URL(v)
  } catch (_) {
    return false
  }
}

export function isNumber(v: unknown): v is number {
  return typeof v === "number"
}

export function isString(v: unknown): v is string {
  return typeof v === "string"
}

export function isBoolean(v: unknown): v is boolean {
  return typeof v === "boolean"
}

export function isArray<T>(v: unknown): v is T[] {
  return Array.isArray(v)
}

export function isFunction(v: unknown): v is () => unknown {
  return typeof v === "function"
}

export function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object"
}

export function isPlainObject(v: unknown): v is Record<string, unknown> {
  return isObject(v) && Object.prototype.toString.call(v) === "[object Object]"
}

export function assert<T>(x: T | undefined | null, msg?: string): asserts x is T {
  if (isUndefined(x) || isNull(x)) {
    throw new Error(msg || "Assertion failed!")
  }
}

// transform string to base64
export function base64(str: string) {
  return Buffer.from(str).toString("base64")
}

//given an object and a function that takes a key and a value, replace the object values with the function result
export function mapObjectValues<I, O, RI = Record<string, I>, RO = Record<string, O>>(
  obj: RI,
  fn: (key: string, value: I) => O
): RO {
  const res = {} as RO
  for (const [key, value] of Object.entries(obj)) {
    // not sure why I need as any here
    ;(res as any)[key] = fn(key, value)
  }
  return res
}

export async function fetchBody(url: string | undefined) {
  if (url === undefined) return undefined
  const res = await fetch(url, {
    headers: {
      "user-agent":
        "CuratedCommonsFetcher/0.1 (https://www.wikimedia.de/en/projects/curated-commons/; alec@konek.to)",
    },
  })
  if (!res.ok) {
    loghttpErr(res)
  }
  try {
    return await res.json()
  } catch (e) {
    logger.error(e)
    return undefined
  }
}

export function multiple(l: any) {
  return l.length && l.length > 1
}

export function maybeResult<T>(f: (any: any) => T): (v: any) => T | undefined {
  return (v: any) => {
    try {
      const res = f(v)
      return res
    } catch (e) {
      logger.error(e)
      return undefined
    }
  }
}

export function warnIfMultiple(l: any, more?: any) {
  if (multiple(l)) {
    logger.warn("more than one entry found, will take first")
    //TODO: this does not work in this case: http://localhost:3000/check/https%3A%2F%2Fcommons.wikimedia.org%2Fwiki%2FMain_Page%23%2Fmedia%2FFile%3ALion_(Panthera_leo)_old_male_Chobe.jpg
  }
}

export function getDomainWithoutSubdomain(url: string): string {
  const urlParts = new URL(url).hostname.split(".")

  return urlParts
    .slice(0)
    .slice(-(urlParts.length === 4 ? 3 : 2))
    .join(".")
}

export function passert(obj: any) {
  // pass assert returns value if true or throws error
  // intended to used to assert single properties like this asser
  if (typeof obj !== "object") assert(false, "should be an object")
  if (Object.keys.length > 1 || Object.keys.length === 0) {
    assert(false, "should have exactly one key")
  }
  const key = Object.keys(obj)[0]
  const val = obj[key ? key : ""]
  assert(val, `${key} is not truthy`)
  return val
}
