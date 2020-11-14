import { Browser } from "playwright";

import { BUTTON_JOIN_GAME, CREATE_GAME, INPUT_GAME_ID, URL } from "./constants";

export default async (browser: Browser, gameId: string) => {
  const page = await browser.newPage();

  await page.goto(URL);

  await page.waitForSelector(CREATE_GAME);

  await page.focus(INPUT_GAME_ID);
  await page.keyboard.type(gameId);

  await page.click(BUTTON_JOIN_GAME);

  return page;
};
