import setup from "./test-runner/setup";
import run from "./test-runner";
import { close, write } from "./test-runner/readline";

import game1 from "./game1";
import game2 from "./game2";

function* gen() {
  yield* setup(game1);
  yield* setup(game2);
}

(async function () {
  write("\n\nBegin Tests\n");

  // @ts-ignore
  await run(gen());

  write("\n\nTests Finished\n\n");
  close();
})();
