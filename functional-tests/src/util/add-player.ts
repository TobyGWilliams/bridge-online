import { Browser } from "playwright";

import { writeLog } from "./logger";

import { BUTTON_JOIN_GAME, INPUT_GAME_ID, URL } from "./constants";

export default async (browser: Browser, gameId: string) => {
  writeLog(`== add player started - ${gameId}`);

  const page = await browser.newPage();

  await page.bringToFront();
  await page.goto(URL);
  await page.waitForSelector(INPUT_GAME_ID);
  await page.focus(INPUT_GAME_ID);
  await page.keyboard.type(gameId);
  await page.click(BUTTON_JOIN_GAME);


  const content = await page.textContent("#application-root");
  expect(content).toContain("Welcome to your game");

  writeLog("== add player succeeded");
  return page;
};
