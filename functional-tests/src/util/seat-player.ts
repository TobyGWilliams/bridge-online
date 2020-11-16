import { Page } from "playwright";

import { log } from "../logger";

import {
  BUTTON_NEW_PLAYER,
  INPUT_PLAYER_NAME,
  SELECT_PLAYER_DIRECTION,
} from "./constants";

const seatPlayer = async (
  page: Page,
  playerName: string,
  direction: string
) => {
  await page.bringToFront();

  // const content = await page.textContent("#application-root");
  // expect(content).toContain("Welcome to your game");

  await page.focus(INPUT_PLAYER_NAME);
  await page.keyboard.type(playerName);
  await page.selectOption(SELECT_PLAYER_DIRECTION, direction);
  await page.click(BUTTON_NEW_PLAYER);

  return;
};

export default (...props: any) =>
  // @ts-ignore
  log(() => seatPlayer(...props), "seat player");
