import { Browser } from "puppeteer"
import { defaultConfig } from "./config"
import { PuppeteerMiddlewareConfiguration } from "./types"
import axios from "axios"
import { Stream } from "stream"

let browserInstance: Browser | undefined = undefined

export const createPDFsFromLinks = async (
  linkUrls?: URL[],
  config?: PuppeteerMiddlewareConfiguration
): Promise<Map<string, Buffer>> => {
  if (linkUrls === undefined || linkUrls.length === 0) {
    return new Map()
  }

  if (browserInstance === undefined) {
    browserInstance = config?.puppeteerCreator
      ? await config.puppeteerCreator()
      : await defaultConfig.puppeteerCreator()
  }

  const pdfBuffers: Map<string, Buffer> = new Map()
  for (const url of linkUrls) {
    const response = await axios.get<Stream>(url.href, {
      responseType: "stream",
    })

    if (response.status === 200) {
      const pathEnding = url.pathname.split("/").slice(-1)[0]
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const contentType = response.headers["content-type"] as string

      const linkFilter = config?.linkFilter ?? (() => true)

      if (contentType.includes("text/html") && linkFilter(url)) {
        const page = await browserInstance.newPage()
        try {
          await page.goto(url.href, {
            waitUntil: "networkidle2",
          })
          await page.emulateMediaType("screen")
          const pdfBuffer = await page.pdf({ format: "Letter" })

          pdfBuffers.set(`${pathEnding}.pdf`, pdfBuffer)
        } finally {
          page.close()
        }
      }
    }
  }

  return pdfBuffers
}
