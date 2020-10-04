import { Logger } from "./types"

export const ConsoleLogger: Logger = {
  debug: (message) => console.debug(message),
  error: (message) => console.error(message),
  warn: (message) => console.warn(message),
  info: (message) => console.info(message),
  trace: (message) => console.log(message),
}

export * from "./types"
