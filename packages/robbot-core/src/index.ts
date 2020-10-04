import { RobBotClient } from "./client"
import { createDefaultConfiguration } from "./configuration"
import { RobBotConfiguration } from "./configuration/types"

export const createClient = (
  configurationOrDiscordApiToken: RobBotConfiguration | string
): RobBotClient => {
  if (typeof configurationOrDiscordApiToken === "string") {
    const discordApiToken = configurationOrDiscordApiToken
    return new RobBotClient(createDefaultConfiguration(discordApiToken))
  }

  const configuration: RobBotConfiguration = configurationOrDiscordApiToken
  return new RobBotClient(configuration)
}

/**
 * Runs a client and blocks until the client exists or crashes
 *
 * @param client client to call `run()` on and block
 */
export const runClient = (client: RobBotClient): void => {
  let finishedRunning = false

  client.run().finally(() => {
    finishedRunning = true
  })

  // block until finished
  while (!finishedRunning) {
    // intentionally empty - do nothing
  }
}

export default createClient

export { createDefaultConfiguration } from "./configuration"

export * from "./client"
export * from "./configuration"
export * from "./handlers"
export * from "./logging"
export * from "./middleware"
export * from "./storage"
