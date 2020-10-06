import http from "http"
import express from "express"
import { RobBotClient } from "../client"
import { HealthCheckConfiguration } from "./types"

// TODO why cant we import this from "discord.js" ?
// https://github.com/discordjs/discord.js/blob/stable/src/util/Constants.js#L156
const Status = {
  READY: 0,
  CONNECTING: 1,
  RECONNECTING: 2,
  IDLE: 3,
  NEARLY: 4,
  DISCONNECTED: 5,
  WAITING_FOR_GUILDS: 6,
  IDENTIFYING: 7,
  RESUMING: 8,
}

export const createDefaultConfiguration = (): HealthCheckConfiguration => ({
  enabled: true,
  path: "/health",
  port: 8080,
})

export const createHealthCheckServer = (
  client: RobBotClient,
  { additionalChecks = [], path, port }: HealthCheckConfiguration
): http.Server => {
  const server = express()

  const defaultHealthCheck = () => client.ws.status !== Status.DISCONNECTED
  const healthChecks: (() => boolean)[] = [defaultHealthCheck, ...additionalChecks]
  const isHealthy = healthChecks.every((check) => check())

  server.get(path, (request, response) => {
    const responseCode = isHealthy ? 200 : 500
    response.status(responseCode)
  })

  return server.listen(port, () => {
    client.configuration.logger.info(`Health check running at http://localhost:${port}`)
  })
}
