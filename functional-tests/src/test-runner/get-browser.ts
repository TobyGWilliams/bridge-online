import { chromium } from "playwright";

import logger from "../logger";

const getBrowser = () =>
  chromium.launch({
    headless: true,
    timeout: 1000,
    logger: {
      isEnabled: () => true,
      log: (name, severity, message, args) => logger(message as string, 3),
    },
  });

export default getBrowser;
