import { Browser } from "playwright";

import addPlayer from "./util/add-player";
import seatPlayer from "./sagas/seat-player";
import wait from "./util/wait";

import { BUTTON_BEGIN_GAME } from "./constants/selectors";
import createGame from "./sagas/create-game";

const SEED = "this is the game seed";

function* test(browser: Browser) {
  const { page1, gameId } = yield* createGame(browser, SEED);
  yield* seatPlayer(page1, "player1Name", "north");

  const page2 = yield addPlayer(browser, gameId as string);
  yield* seatPlayer(page2, "player2Name", "east");

  const page3 = yield addPlayer(browser, gameId as string);
  yield* seatPlayer(page3, "player3Name", "south");

  const page4 = yield addPlayer(browser, gameId as string);
  yield* seatPlayer(page4, "player4Name", "west");

  yield wait(500);

  yield page1.click(BUTTON_BEGIN_GAME);
}

export default {
  test,
  name: "Just start the game",
};
