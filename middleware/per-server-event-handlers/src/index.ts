import { PerServerEventHandlers } from "./types"
import { EventHandlersCreator, EventHandlers } from "@robbot/robbot-core"
import { produce } from "immer"
import { EventHandlerMiddleware } from "@robbot/robbot-core"
import { RobBotClient } from "@robbot/robbot-core"

export const createServerFilterMiddleware = (
  configuration: PerServerEventHandlers
): EventHandlerMiddleware => {
  // TODO is there a way to write this in ES6 () => {} syntax?
  function newMiddleware(eventHandlers: EventHandlers): EventHandlers
  function newMiddleware(
    eventHandlersCreator: EventHandlersCreator
  ): EventHandlersCreator

  function newMiddleware(eventHandlersOrCreator: unknown): unknown {
    const isFunction = typeof eventHandlersOrCreator === "function"
    const isObject = typeof eventHandlersOrCreator === "object"

    if (isFunction) {
      const eventCreator = (eventHandlersOrCreator as unknown) as EventHandlersCreator
      const returnValue = (client: RobBotClient) => {
        return eventCreator(client)
      }

      return returnValue
    } else if (isObject) {
      const eventHandlers = (eventHandlersOrCreator as unknown) as EventHandlers
      const newEventHandlers = produce(eventHandlers, (draft) => {
        draft.message = (message) => {
          if (message.guild) {
            const guildSnowflake = message.guild.id
            const guildMessageHandler = configuration[guildSnowflake]?.message

            if (guildMessageHandler) {
              guildMessageHandler(message)
            } else {
              eventHandlers.message(message)
            }
          }
        }
      })

      return newEventHandlers
    }

    // in case of incorrect argument type, no-op
    return eventHandlersOrCreator
  }

  return newMiddleware
}

export * from "./types"
