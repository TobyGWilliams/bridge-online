import fs from "fs";

const logger = fs.createWriteStream(__dirname + "/debug.log", { flags: "w" });

export const writeLog = (message: string, depth = 1) => {
  if (depth !== 1) {
    logger.write("\t");
  }

  return logger.write(message + "\n");
};
