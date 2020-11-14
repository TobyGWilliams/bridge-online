import { Page } from "playwright";

import {
  BUTTON_NEW_PLAYER,
  INPUT_PLAYER_NAME,
  SELECT_PLAYER_DIRECTION,
} from "./constants";
import { writeLog } from "./logger";

export default async (page: Page, playerName: string, direction: string) => {
  writeLog(`== seat player started - ${playerName} - ${direction}`);

  await page.bringToFront();

  const content = await page.textContent("#application-root");
  expect(content).toContain("Welcome to your game");

  await page.focus(INPUT_PLAYER_NAME);
  await page.keyboard.type(playerName);
  await page.selectOption(SELECT_PLAYER_DIRECTION, direction);
  await page.click(BUTTON_NEW_PLAYER);

  writeLog("== seat player started - playerName - direction");

  return;
};
