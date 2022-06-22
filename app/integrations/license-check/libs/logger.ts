import consola, { LogLevel } from "consola"
import { Response } from "node-fetch"

export const logger = consola.create({ level: LogLevel.Info })
export default logger

export function loghttpErr(res: Response): void {
  logger.error(`HTTP FAIL: ${res.status} ${res.statusText}`)
}
