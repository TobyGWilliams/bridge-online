import { Browser } from "playwright";

import getBrowser from "./get-browser";
import { log } from "../logger";

export default function* setup(
  func: (browser: Browser) => Generator
): Generator {
  const browser: any = yield getBrowser();
  // const browser = await log(getBrowser, "setup", 1);

  try {
    yield* func(browser);
  } catch (error) {
    yield browser.close();
    throw error;
  }

  yield browser.close();
}
