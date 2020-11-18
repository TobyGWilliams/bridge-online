import setup from "./test-runner/setup";
import run from "./test-runner";
import { close, write } from "./test-runner/readline";

import game1 from "./game1";
import game2 from "./game2";
import game3 from "./game3";

function* gen() {
  yield* setup(game1);
  yield* setup(game2);
  yield* setup(game3);
}

(async function () {
  write("\n\nBegin Tests\n\n");

  // @ts-ignore
  await run(gen());

  write("\nTests Finished\n\n");
  close();
})();
