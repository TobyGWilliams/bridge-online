import { Page } from "playwright";

export default async (page: Page) =>
  page.evaluate(() =>
    // @ts-ignore
    document.querySelector('meta[name="game-id"]').getAttribute("content")
  );
