import setup from "./test-runner/setup";
import run from "./test-runner";
import { close } from "./test-runner/pause";

import game1 from "./game1";
import game2 from "./game2";
import game3 from "./game3";

function* gen() {
  yield* setup(game1);
  yield* setup(game2);
  yield* setup(game3);
}

(async function () {
  console.clear();

  // @ts-ignore
  await run(gen());

  // @ts-check
  close();
})();
