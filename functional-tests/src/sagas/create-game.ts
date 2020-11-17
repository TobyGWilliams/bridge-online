import { Browser, Page } from "playwright";

import getGameId from "../util/get-game-id";
import wait from "../util/wait";
import { log } from "../logger";

import { CREATE_GAME, INPUT_GAME_SEED, URL } from "../constants/selectors";

interface ouput {
  gameId: string;
  page1: Page;
}

const createGame = function* (browser: Browser, SEED: string) {
  const page1 = yield browser.newPage();

  yield page1.goto(URL);

  yield page1.waitForSelector(CREATE_GAME);
  yield page1.focus(INPUT_GAME_SEED);
  yield page1.keyboard.type(SEED);
  yield page1.click(CREATE_GAME);

  yield wait(500);

  const gameId = yield getGameId(page1);

  // expect(gameId).not.toEqual("");
  return { gameId: gameId as string, page1 };
};

// export default (...props: any) =>
//   
//   log(() => createGame(...props), "create game");

export default createGame;
