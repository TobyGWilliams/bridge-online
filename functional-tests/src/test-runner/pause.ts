import { on, write } from "./readline";

export default () => {
  write("\n\t\t- test execution paused\n\t\t- use enter to resume ");
  return new Promise((resolve) => {
    on("line", () => {
      resolve();
    });
  });
};
