import { createClient, createDefaultConfiguration, EventHandlers, LogLevel } from "@robbot/robbot-core"
import { createLoggingLevelFilter, LogLevelFilterConfiguration } from "@robbot/logging-filter"
import { createServerFilterMiddleware } from "@robbot/per-server-event-handlers"
import { Message, TextChannel } from "discord.js"
import { handleMessageWithLink } from "./handlers/message"
import { KubeConfig, AppsV1Api, PatchUtils } from "@kubernetes/client-node"
import _ from "lodash"

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

          if (message.content === "!reboot") {
            const minuteInMills = 60 * 1000
            const rebootFunc = _.throttle(() => {
              const kc = new KubeConfig()
              kc.loadFromDefault()

              const jsonPatch = [
                {
                  op: "replace",
                  path: "/spec/template/metadata/annotations",
                  value: {
                    "app.robbot/restartedAt": `${new Date().toISOString()}`,
                  },
                },
              ]

              const appsApi = kc.makeApiClient(AppsV1Api)
              // Header as per https://github.com/kubernetes/kubernetes/issues/61103#issuecomment-372641200
              // and per https://github.com/kubernetes-client/javascript/blob/master/examples/patch-example.js#L19
              const options = { headers: { "Content-type": PatchUtils.PATCH_FORMAT_JSON_PATCH } }
              return appsApi.patchNamespacedDeployment(
                "valheim",
                "valheim",
                jsonPatch,
                undefined,
                undefined,
                undefined,
                undefined,
                options
              )
            }, minuteInMills)

            const resultPromise = rebootFunc()
            resultPromise &&
              resultPromise
                .then(() => {
                  message.reply("Reboot done")
                })
                .catch((error: Error) => {
                  message.reply(`Error rebooting: ${error}`)
                  configuration.logger.error(`Error rebooting: ${error}
                  ${JSON.stringify(error, undefined, 2)}`)
                })
            return
          }

          if (message.content.startsWith("!")) {
            message.reply("I don't recognize that.")
            return
          }
        },
      },
      defaultEventHandlers: configuration.eventHandlers as EventHandlers,
    }),
  ],
  loggingMiddleware: [createLoggingLevelFilter(loggingConfiguration)],
}

const robBot = createClient(configuration)

robBot.run().catch((error: Error) => {
  console.error("Error received:", error)
  process.exit(1)
})
