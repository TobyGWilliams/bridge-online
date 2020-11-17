import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export function close() {
  rl.close();
}

export default () => {
  rl.write("test execution paused - use Enter to resume execution");
  return new Promise((resolve) => {
    rl.on("line", () => {
      resolve();
    });
  });
};
