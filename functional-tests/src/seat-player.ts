import { Page } from "playwright";

import logger from "./logger";

import {
  BUTTON_NEW_PLAYER,
  INPUT_PLAYER_NAME,
  SELECT_PLAYER_DIRECTION,
} from "./constants";

export default async (page: Page, playerName: string, direction: string) => {
  logger(`seat player, name: ${playerName}, direction: ${direction}`);

  await page.focus(INPUT_PLAYER_NAME);
  await page.keyboard.type(playerName);

  await page.selectOption(SELECT_PLAYER_DIRECTION, direction);

  await page.click(BUTTON_NEW_PLAYER);
};
