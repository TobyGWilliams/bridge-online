import setup from "./test-runner/setup";
import run from "./test-runner";
import { close, write } from "./test-runner/readline";

import game1 from "./tests/game1";
import game2 from "./tests/game2";
import game3 from "./tests/game3";

function* gen() {
  yield* setup(game1);
  // yield* setup(game2);
  // yield* setup(game3);
}

(async function () {
  write("\n\nBegin Tests\n");

  // @ts-ignore
  await run(gen());

  write("\n\nTests Finished\n\n");
  close();
})();
