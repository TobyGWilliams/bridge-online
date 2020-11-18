import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export function on(name: string, listener: (...args: any[]) => void) {
  return rl.on(name, listener);
}

export function write(message: string) {
  rl.write(message);
}

export function close() {
  rl.close();
}
