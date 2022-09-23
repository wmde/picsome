import { useRef } from "react"

let counter = Math.pow(2, 10)

export const useUniqueId = (prefix: string = "uid-") => {
  const { current: id } = useRef(generateUniqueId(prefix))
  return id
}

const generateUniqueId = (prefix: string) => {
  const uid = (counter++).toString(36)
  return prefix + uid
}
