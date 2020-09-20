import {
  createClient,
  createDefaultConfiguration,
  EventHandlers,
  LogLevel,
} from "@robbot/robbot-core"
import {
  createLoggingLevelFilter,
  LogLevelFilterConfiguration,
} from "@robbot/logging-filter"
import { createServerFilterMiddleware } from "@robbot/per-server-event-handlers"
import { Message, TextChannel } from "discord.js"
import { handleMessageWithLink } from "./handlers/message"

const apiToken = process.env.DISCORD_API_TOKEN

if (typeof apiToken !== "string") {
  console.error(
    `Error, environment variable <DISCORD_API_TOKEN> is not correctly set! Current value is <${apiToken}>`
  )
  process.exit(1)
}

const configuration = createDefaultConfiguration(apiToken)
const loggingConfiguration: LogLevelFilterConfiguration = {
  logLevel: LogLevel.DEBUG,
}

configuration.middleware = {
  eventHandlerMiddleware: [
    createServerFilterMiddleware({
      // personal discord server
      "363079999462309908": {
        message: (message: Message) => {
          const messageChannel = message.channel
          const messageAuthor = message.author

          if (messageChannel && messageAuthor && !messageAuthor.bot) {
            if (messageChannel instanceof TextChannel) {
              handleMessageWithLink(
                message,
                configuration.logger
              ).catch((error) =>
                configuration.logger.error(
                  `Error in handleMessageWithLink(): ${error}`
                )
              )
            }
          }
        },
      },
      defaultEventHandlers: configuration.eventHandlers as EventHandlers,
    }),
  ],
  loggingMiddleware: [createLoggingLevelFilter(loggingConfiguration)],
}

const robBot = createClient(configuration)

robBot.run().catch((error) => {
  console.error("Error received:", error)
  process.exit(1)
})
