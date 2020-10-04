import { EventHandlers } from "@robbot/robbot-core/dist/handlers"

export interface PerServerEventHandlers
  extends Record<string, Partial<EventHandlers>> {
  defaultEventHandlers: EventHandlers
}
