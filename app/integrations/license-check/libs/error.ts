export type Error = {
  message?: string
  [x: string]: unknown
}

// generate an error object with message and properties
export default function error(err: Error) {
  return Object.assign(new Error(err.message), err)
}
