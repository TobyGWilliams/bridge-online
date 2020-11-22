import { Page } from "playwright";

export default async (page: Page) => {
  const meta = await page.evaluate(() =>
    // @ts-ignore
    document.querySelector('meta[name="state"]').getAttribute("content")
  );
  return JSON.parse(meta as string);
};
