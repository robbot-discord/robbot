import {
  Logger,
  LoggerCreator,
  LoggingMiddleware,
  LogLevel,
  LogLevelToNumber,
  RobBotClient,
} from "@robbot/robbot-core"
import { LogLevelFilterConfiguration } from "./types"

export const createLoggingLevelFilter = (
  configuration: LogLevelFilterConfiguration
): LoggingMiddleware => {
  return (otherCreator: LoggerCreator): LoggerCreator => {
    return (client: RobBotClient): Logger => {
      const logger = otherCreator(client)

      const { logLevel } = configuration
      const logLevelNum = LogLevelToNumber[logLevel]

      const { ERROR, WARN, INFO, DEBUG, TRACE } = LogLevel
      const noOp = () => {
        return
      }

      const wrappedLogger: Logger = {
        error:
          logLevelNum >= LogLevelToNumber[ERROR]
            ? (message) => logger.error(message)
            : noOp,
        warn:
          logLevelNum >= LogLevelToNumber[WARN]
            ? (message) => logger.warn(message)
            : noOp,
        info:
          logLevelNum >= LogLevelToNumber[INFO]
            ? (message) => logger.info(message)
            : noOp,
        debug:
          logLevelNum >= LogLevelToNumber[DEBUG]
            ? (message) => logger.debug(message)
            : noOp,
        trace:
          logLevelNum >= LogLevelToNumber[TRACE]
            ? (message) => logger.trace(message)
            : noOp,
      }

      return wrappedLogger
    }
  }
}

export * from "./types"
