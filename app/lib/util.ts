import logger from "integrations/license-check/libs/logger"
import _ from "lodash"

export function find(elems: any[], obj: any) {
  // const found = elems.filter((elem) => {
  //   return JSON.stringify(project(elem, Object.keys(obj))) === JSON.stringify(obj)
  // })
  // if (found.length > 1) throw new Error("abiguous search input found more than one")
  const found = _.filter(elems, _.matches(obj))
  if (found.length > 1) throw new Error("abiguous search input found more than one")
  if (found.length === 0) {
    logger.error("couldnt find result: ")
    logger.error(elems)
    logger.error(obj)
    throw new Error("failed search")
  }
  return found[0]
}
export function project(obj: object, keys: String[]) {
  const keysSet = new Set(keys)
  return Object.assign(
    {},
    ...Object.entries(obj).flatMap(([k, v]) => (keysSet.has(k) ? [{ [k]: v }] : []))
  )
}

export function formatDateForExport(isodate: Date | null | undefined) {
  // format the dates
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
    timeZone: "Europe/Berlin",
  }

  return Intl.DateTimeFormat("de-DE", options).format(new Date(isodate || ""))
}
