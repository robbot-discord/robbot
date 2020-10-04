import { EventHandlersCreator } from "../handlers/types"
import { StorageHandlerCreator } from "../storage/types"
import { LoggerCreator } from "../logging"

export interface LoggingMiddleware {
  (loggerCreator: LoggerCreator): LoggerCreator
}

export interface EventHandlerMiddleware {
  (eventCreator: EventHandlersCreator): EventHandlersCreator
}

export interface StorageMiddleware {
  (storageCreator: StorageHandlerCreator): StorageHandlerCreator
}
