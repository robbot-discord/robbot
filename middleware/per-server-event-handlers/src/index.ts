import { PerServerEventHandlers } from "./types"
import { EventHandlersCreator } from "@robbot/robbot-core"
import { produce } from "immer"
import { EventHandlerMiddleware } from "@robbot/robbot-core"
import { RobBotClient } from "@robbot/robbot-core"
import { Message } from "discord.js"

export const createServerFilterMiddleware = (configuration: PerServerEventHandlers): EventHandlerMiddleware => {
  const newMiddleware = (eventHandlersCreator: EventHandlersCreator): EventHandlersCreator => {
    return (client: RobBotClient) => {
      const eventHandlers = eventHandlersCreator(client)
      const logger = client.configuration.logger

      const newMessageHandler = (message: Message) => {
        if (!message.guild) {
          return
        }

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

      const newEventHandlers = produce(eventHandlers, (draft) => {
        draft.message = newMessageHandler
      })

      return newEventHandlers
    }
  }

  return newMiddleware
}

export * from "./types"
