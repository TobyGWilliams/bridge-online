import { Page } from "playwright";

import { CREATE_GAME, INPUT_GAME_SEED, URL } from "./constants";
import getGameId from "./get-game-id";
import wait from "./wait";

export default async (page1: Page, SEED: string): Promise<string> => {
  await page1.goto(URL);

  await page1.waitForSelector(CREATE_GAME);
  await page1.focus(INPUT_GAME_SEED);
  await page1.keyboard.type(SEED);
  await page1.click(CREATE_GAME);

  await wait(500);

  const gameId = await getGameId(page1);

  expect(gameId).not.toEqual("");

  return gameId as string;
};
