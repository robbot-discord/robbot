import { RobBotClient } from "../client"

export type id = string | number

export interface ObjectWithId {
  id: id
}

export interface StorageHandlerCreator {
  (client: RobBotClient): StorageHandler
}

export interface StorageHandler<T extends ObjectWithId = ObjectWithId> {
  store(objectToStore: T): T
  retrieve(id: id): T
}
