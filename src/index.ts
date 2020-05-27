import { createClient, createDefaultConfiguration } from "@robbot/robbot-core"

const apiToken = process.env.DISCORD_API_TOKEN as string

const configuration = createDefaultConfiguration(apiToken)
const robBot = createClient(configuration)

robBot.run()
