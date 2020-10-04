import { PuppeteerMiddlewareConfiguration } from "./types"
import puppeteer from "puppeteer"

export const defaultConfig: Required<PuppeteerMiddlewareConfiguration> = {
  linkFilter: (urls) => true,
  puppeteerCreator: () =>
    puppeteer.launch({
      executablePath: "/usr/bin/chromium-browser",
    }),
}
