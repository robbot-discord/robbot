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
