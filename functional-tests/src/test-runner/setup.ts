import { Browser } from "playwright";

import getBrowser from "./get-browser";
import { updateLine, write, close } from "./readline";

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
    write(`\n\n\nSummary of Failures:\n\n\n`);
    close();

    yield browser.close();

    throw error;
  }
  updateLine(`\tPASS: ${name}`);
  yield browser.close();
}
