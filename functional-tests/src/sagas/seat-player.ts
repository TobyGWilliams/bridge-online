import { Page } from "playwright";

import { log } from "../logger";

import {
  BUTTON_NEW_PLAYER,
  INPUT_PLAYER_NAME,
  SELECT_PLAYER_DIRECTION,
} from "../constants/selectors";

function* seatPlayer(page: Page, playerName: string, direction: string) {
  yield page.bringToFront();

  // const content = yield page.textContent("#application-root");
  // expect(content).toContain("Welcome to your game");
  yield page.focus(INPUT_PLAYER_NAME);
  yield page.keyboard.type(playerName);
  yield page.selectOption(SELECT_PLAYER_DIRECTION, direction);
  yield page.click(BUTTON_NEW_PLAYER);

  return;
}

// export default (...props: any) =>
//   // @ts-ignore
//   log(() => seatPlayer(...props), "seat player");

export default seatPlayer;
