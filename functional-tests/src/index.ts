import setup from "./test-runner/setup";
import run from "./test-runner";

import game1 from "./game1";
import game2 from "./game2";
import game3 from "./game3";

const testFiles = [game1, game2, game3];

async function* gen() {
  for (let index = 0; index < testFiles.length; index++) {
    yield await setup(testFiles[index]);
  }
}

(async function () {
  // @ts-ignore
  run(gen(testFiles));
})();
