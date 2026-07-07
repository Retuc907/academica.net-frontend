import { Builder, WebDriver } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";

export const BASE_URL = process.env.TEST_BASE_URL ?? "http://localhost:5173";
export const DEFAULT_TIMEOUT = Number(process.env.TEST_TIMEOUT ?? 90000);
export const IS_CI = process.env.CI === "true";

export async function buildDriver(): Promise<WebDriver> {
  const options = new chrome.Options();

  if (IS_CI) {
    options.addArguments(
      "--headless=new",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--window-size=1920,1080"
    );
  }

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  if (!IS_CI) {
    await driver.manage().window().maximize();
  }

  await driver.manage().setTimeouts({
    implicit: DEFAULT_TIMEOUT,
    pageLoad: DEFAULT_TIMEOUT,
    script: DEFAULT_TIMEOUT,
  });

  return driver;
}
