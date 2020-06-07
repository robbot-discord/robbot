import {
  createClient,
  createDefaultConfiguration,
  LogLevel,
  runClient,
} from "@robbot/robbot-core"
import {
  createLoggingLevelFilter,
  LogLevelFilterConfiguration,
} from "@robbot/robbot-core/dist/middleware/logging"

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
  loggingMiddleware: [createLoggingLevelFilter(loggingConfiguration)],
}

const robBot = createClient(configuration)

robBot.run().catch(() => process.exit(1))
