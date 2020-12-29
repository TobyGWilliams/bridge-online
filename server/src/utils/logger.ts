import * as fs from "fs";
import { isRegExp } from "util";

const logger = fs.createWriteStream(__dirname + "/../../output/debug.log", {
  flags: "w",
});

const write = (message: string | object) => {
  if (!message) return;

  if (typeof message === "string") {
    return logger.write(message + "\n");
  }

  logger.write(JSON.stringify(message, null, 2) + "\n");
};

export default write;
