import { ClientEvents } from "discord.js"
import { RobBotClient } from ".."

// TODO is there a better type constraint than 'void' ?
export type EventHandlers = {
  [K in keyof ClientEvents]: (...args: ClientEvents[K]) => void
}

export interface EventHandlersCreator {
  (client: RobBotClient): EventHandlers
}
