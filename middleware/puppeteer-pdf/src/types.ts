import puppeteer from "puppeteer"

export interface PuppeteerMiddlewareConfiguration {
  linkFilter?: (links: URL) => boolean
  puppeteerCreator?: () => Promise<puppeteer.Browser>
}

export {}
