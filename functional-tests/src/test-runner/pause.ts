import { on, write } from "./readline";

export default () => {
  write("\n\ttest execution paused\n\tuse enter to resume ");
  return new Promise((resolve) => {
    on("line", () => {
      resolve();
    });
  });
};
