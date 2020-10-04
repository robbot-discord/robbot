import {
  EventHandlerMiddleware,
  Logger,
  RobBotClient,
} from "@robbot/robbot-core/dist"
import { EventHandlersCreator } from "@robbot/robbot-core/dist/handlers"
import { DMChannel, Message, MessageAttachment, TextChannel } from "discord.js"
import { defaultConfig } from "./config"
import { createPDFsFromLinks } from "./puppeteer"
import { PuppeteerMiddlewareConfiguration } from "./types"

export const getLinksInString = (str: string): URL[] => {
  const linkRegex = /(https?:\/\/[\S]+)/gi
  const linkMatches = str.match(linkRegex)

  const linkUrls: URL[] = []
  if (linkMatches) {
    for (const linkMatch of linkMatches) {
      try {
        const linkUrl = new URL(linkMatch)
        linkUrls.push(linkUrl)
      } catch (e) {
        // no-op
      }
    }
  }

  return linkUrls
}

export const createPuppeteerPdfMiddleware = (
  logger: Logger,
  config: PuppeteerMiddlewareConfiguration = defaultConfig
): EventHandlerMiddleware => {
  const returnValue = (eventHandlerCreator: EventHandlersCreator) => {
    return (client: RobBotClient) => {
      const otherHandlers = eventHandlerCreator(client)

      return {
        ...otherHandlers,
        message: async (message: Message) => {
          const messageChannel = message.channel

          if (
            messageChannel instanceof TextChannel ||
            messageChannel instanceof DMChannel
          ) {
            const linkUrls = getLinksInString(message.content)

            const linksToPdfMap = await createPDFsFromLinks(linkUrls, config)

            for (const [link, pdfBuffer] of linksToPdfMap) {
              const attachment = new MessageAttachment(pdfBuffer)
              messageChannel.send(`PDF capture of ${link}`, attachment)
            }
          }

          // call other handlers
          otherHandlers.message(message)
        },
      }
    }
  }
  return returnValue
}

export * from "./types"
