import { Browser } from "playwright";

import getBrowser from "./get-browser";
import { log } from "../logger";
import { updateLine, write } from "./readline";

type TestFile = {
  test: (browser: Browser) => Generator;
  name: string;
};

export default function* setup({ test, name }: TestFile): Generator {
  write(`\n\tTEST: ${name}`);
  const browser: any = yield getBrowser();

  try {
    yield* test(browser);
  } catch (error) {
    updateLine(`\tFAIL: ${name}`);
    yield browser.close();
    throw error;
  }
  updateLine(`\tPASS: ${name}`);
  yield browser.close();
}
