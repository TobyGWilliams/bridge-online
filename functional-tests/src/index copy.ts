import game1 from "./game1";
import game2 from "./game2";
import getBrowser from "./util/get-browser";
import { log } from "./logger";

(async function () {
  const browser = await log(getBrowser, "setup", 1);

  try {
    await log(() => game1(browser), "game-1", 1);
    await log(() => game2(browser), "game-2", 1);
    await log(() => browser.close(), "teardown", 1);
  } catch (err) {
    browser.close();
    throw err;
  }
})();
