import { RobBotClient } from "../client"

export type LogMessage = string | Error

export type LogHandler = (message: LogMessage) => void

/**
 * Lower is more critical, high is less critical.
 *
 * i.e. 'trace' is highest, 'error' is lowest
 */

export enum LogLevel {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  DEBUG = "debug",
  TRACE = "trace",
}

export const LogLevelToNumber: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  trace: 4,
}

export type Logger = Record<LogLevel, LogHandler>

export interface LoggerCreator {
  (client: RobBotClient): Logger
}
