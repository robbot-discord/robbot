import { createClient, createDefaultConfiguration, EventHandlers, LogLevel } from "@robbot/robbot-core"
import { createLoggingLevelFilter, LogLevelFilterConfiguration } from "@robbot/logging-filter"
import { createServerFilterMiddleware } from "@robbot/per-server-event-handlers"
import { Message, TextChannel } from "discord.js"
import { handleMessageWithLink } from "./handlers/message"

const apiToken = process.env.DISCORD_API_TOKEN

if (typeof apiToken !== "string") {
  console.error(`Error, environment variable <DISCORD_API_TOKEN> is not correctly set! Current value is <${apiToken}>`)
  process.exit(1)
}

const configuration = createDefaultConfiguration(apiToken)
const loggingConfiguration: LogLevelFilterConfiguration = {
  logLevel: LogLevel.TRACE,
}

configuration.middleware = {
  eventHandlerMiddleware: [
    createServerFilterMiddleware({
      // personal discord server
      "363079999462309908": {
        message: (message: Message) => {
          const { channel: messageChannel, author: messageAuthor } = message

          if (messageChannel && messageAuthor && !messageAuthor.bot) {
            if (messageChannel instanceof TextChannel) {
              handleMessageWithLink(message, configuration.logger).catch((error) =>
                configuration.logger.error(`Error in handleMessageWithLink(): ${error}`)
              )
            }
          }
        },
      },
      // static init discord
      "702260036105142282": {
        message: (message: Message) => {
          const channel = message.channel
          // bot-spam text channel
          if (channel.id !== "757436038586040401") return

          if (message.author.bot) return

          message.reply("Hello I am RobBot.")
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
