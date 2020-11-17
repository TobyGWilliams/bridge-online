import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("close", () => {
  console.log(`Close!`);
});

export function close() {
  console.log("close rl");
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
