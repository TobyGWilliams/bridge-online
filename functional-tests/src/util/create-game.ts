import { Browser, Page } from "playwright";

import getGameId from "./get-game-id";
import wait from "./wait";
import { log } from "../logger";

import { CREATE_GAME, INPUT_GAME_SEED, URL } from "../constants/selectors";

const createGame = async function (
  browser: Browser,
  SEED: string
): Promise<{ gameId: string; page1: Page }> {
  const page1 = await browser.newPage();

  await page1.goto(URL);

  await page1.waitForSelector(CREATE_GAME);
  await page1.focus(INPUT_GAME_SEED);
  await page1.keyboard.type(SEED);
  await page1.click(CREATE_GAME);

  await wait(500);

  const gameId = await getGameId(page1);

  // expect(gameId).not.toEqual("");
  return { gameId: gameId as string, page1 };
};

export default (...props: any) =>
  // @ts-ignore
  log(() => createGame(...props), "create game");
