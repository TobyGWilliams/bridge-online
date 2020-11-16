import fs from "fs";

const logger = fs.createWriteStream(__dirname + "/../../output/debug.log", {
  flags: "w",
});

const write = (message: string, depth = 2) => {
  for (let index = 0; index < depth - 1; index++) {
    logger.write("\t");
  }

  return logger.write(message + "\n");
};

export async function log<T>(func: () => T, message: string, depth = 2) {
  write(`=> ${message}`, depth);
  return await func();
}

export default write;
