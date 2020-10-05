import { Logger } from "@robbot/robbot-core"
import axios, { AxiosError } from "axios"
import { Message, TextChannel } from "discord.js"
import fs from "fs"
import getStream from "get-stream"
import os from "os"
import path, { sep } from "path"
import { Stream } from "stream"
import { v4 as uuid } from "uuid"

const saveStreamToTempFile = async (stream: Stream, fileName: string = uuid(), fileExt = ".tmp"): Promise<string> => {
  const osTmpDir = os.tmpdir() + sep
  const tmpDir = fs.promises.mkdtemp(osTmpDir)
  const buffer = await getStream.buffer(stream)

  const tmpFilePath = path.join(await tmpDir, `${fileName}${fileExt}`)

  await fs.promises.writeFile(tmpFilePath, buffer)
  return tmpFilePath
}

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

const createArchiveLinks = async (url: URL, logger: Logger) => {
  const archiveSites = [
    {
      archiveSite: new URL("https://arch.b4k.co/"),
      transform: (archiveSite: URL) => {
        archiveSite.hash = archiveSite.hash.replace("p", "q")
        return archiveSite
      },
    },
    {
      archiveSite: new URL("https://desuarchive.org/"),
      transform: (archiveSite: URL) => {
        archiveSite.hash = archiveSite.hash.replace("p", "")
        return archiveSite
      },
    },
    {
      archiveSite: new URL("https://archive.4plebs.org/"),
    },
    {
      archiveSite: new URL("https://archived.moe/"),
    },
  ]

  const validArchiveLinks: URL[] = []
  for (const { archiveSite, transform } of archiveSites) {
    archiveSite.pathname = url.pathname
    archiveSite.hash = url.hash
    const transformedArchiveSite = transform ? transform(archiveSite) : archiveSite

    const { status } = await axios.get(transformedArchiveSite.href).catch((error: AxiosError) => {
      logger.info(`createArchiveLinks(): ${url.href} => ${transformedArchiveSite.href}` + sep + `Error: ${error}`)
      return error.response || { status: 404 }
    })
    if (status === 200) {
      validArchiveLinks.push(transformedArchiveSite)
    }
  }
  return validArchiveLinks
}

export const handleMessageWithLink = async (message: Message, logger: Logger): Promise<Message | undefined> => {
  const messageChannel = message.channel

  const linkUrls = getLinksInString(message.content)

  if (linkUrls.length === 0 || messageChannel === undefined || !(messageChannel instanceof TextChannel)) {
    logger.info("No links in message found")
    return undefined
  }

  logger.info(`Found links in message: <${linkUrls}>`)

  for (const url of linkUrls) {
    const response = await axios.get<Stream>(url.href, {
      responseType: "stream",
    })

    if (response.status === 200) {
      const pathEnding = url.pathname.split("/").slice(-1)[0]
      const [fileName, fileExt] = pathEnding.split(".")
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const contentType = response.headers["content-type"] as string

      if (contentType.startsWith("image") && (url.origin.includes("4cdn") || url.origin.includes("4chan"))) {
        const tmpFilePath = await saveStreamToTempFile(response.data, fileName, fileExt)
        const tmpFileBuffer = await fs.promises.readFile(tmpFilePath)
        return await messageChannel.send(undefined, {
          files: [{ attachment: tmpFileBuffer, name: `${fileName}.${fileExt}` }],
        })
        return
      } else if (contentType.includes("text/html") && (url.origin.includes("4cdn") || url.origin.includes("4chan"))) {
        const archiveLinks = await createArchiveLinks(url, logger)
        const archiveLink = archiveLinks[0]

        return await messageChannel.send(archiveLink, {
          embed: undefined,
        })
      }
    }
  }
}
