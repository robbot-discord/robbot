import { PerServerEventHandlers } from "./types"
import { EventHandlersCreator, EventHandlers } from "@robbot/robbot-core"
import { produce } from "immer"
import { EventHandlerMiddleware } from "@robbot/robbot-core"
import { RobBotClient } from "@robbot/robbot-core"

export const createServerFilterMiddleware = (
  client: RobBotClient,
  configuration: PerServerEventHandlers
): EventHandlerMiddleware => {
  const newMiddleware = (eventHandlersCreator: EventHandlersCreator): EventHandlersCreator => {
    const eventHandlers = eventHandlersCreator(client)
    const logger = client.configuration.logger
    const newEventHandlers = produce(eventHandlers, (draft) => {
      draft.message = (message) => {
        if (message.guild) {
          const guildSnowflake = message.guild.id
          const guildMessageHandler = configuration[guildSnowflake]?.message

          if (guildMessageHandler) {
            logger.debug(`Found guildMessageHandler for guild.id <${guildSnowflake}>`)
            guildMessageHandler(message)
          } else {
            logger.debug(`No guildMessageHandler found for guild.id <${guildSnowflake}>, using default`)
            eventHandlers.message(message)
          }
        }
      }
    })

    return () => newEventHandlers
  }

  return newMiddleware
}

export * from "./types"
