import { Browser } from "playwright";

import { log } from "../logger";

import { BUTTON_JOIN_GAME, INPUT_GAME_ID, URL } from "../constants/selectors";

async function addPlayer(browser: Browser, gameId: string) {
  const page = await browser.newPage();

  await page.bringToFront();
  await page.goto(URL);
  await page.waitForSelector(INPUT_GAME_ID);
  await page.focus(INPUT_GAME_ID);
  await page.keyboard.type(gameId);
  await page.click(BUTTON_JOIN_GAME);

  const content = await page.textContent("#application-root");

  // expect(content).toContain("Welcome to your game");
  return page;
}

export default (...props: any) =>
  // @ts-ignore
  log(() => addPlayer(...props), "add player");
