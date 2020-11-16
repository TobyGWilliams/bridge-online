import run from ".";
import getBrowser from "../util/get-browser";
import { log } from "../logger";

export default async function setup(func: Function) {
  const browser = await log(getBrowser, "setup", 1);
  try {
    await run(func(browser));
  } catch (error) {
    browser.close();
    throw error;
  }

  await browser.close();
}
