import { chromium } from "playwright";

import logger, { log } from "../logger";

const getBrowser = () =>
  chromium.launch({
    headless: false,
    timeout: 1000,
    logger: {
      isEnabled: () => true,
      log: (name, severity, message, args) => logger(message as string, 3),
    },
  });

// export default (...props: any) =>
//   // @ts-ignore
//   log(() => getBrowser(...props), "get browser");

export default getBrowser;

