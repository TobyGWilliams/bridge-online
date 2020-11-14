import { chromium, Page } from "playwright";

import addPlayer from "./add-player";
import seatPlayer from "./seat-player";
import getGameId from "./get-game-id";
import checkPlayerCards from "./check-player-cards";
import getBidButtonByBid from "./get-bid-button-by-bid";

import {
  BUTTON_JOIN_GAME,
  BUTTON_NEW_PLAYER,
  BUTTON_BEGIN_GAME,
  BUTTON_PLACE_BID,
  CREATE_GAME,
  INPUT_GAME_ID,
  INPUT_PLAYER_NAME,
  INPUT_GAME_SEED,
  SELECT_PLAYER_DIRECTION,
  PLAYER1CARDS,
  PLAYER2CARDS,
  PLAYER3CARDS,
  PLAYER4CARDS,
  URL,
} from "./constants";
import logger from "./logger";
import bid from "./bid";

const SEED = "this is the game seed";

(async () => {
  console.clear();
  console.log(`\n\nBegin game\nSeed: ${SEED}`);

  const browser = await chromium.launch({ headless: false, devtools: true });
  const page1 = await browser.newPage();

  await page1.goto(URL);

  await page1.waitForSelector(CREATE_GAME);

  await page1.focus(INPUT_GAME_SEED);
  await page1.keyboard.type(SEED);

  logger("create game");
  await page1.click(CREATE_GAME);

  const gameId = await getGameId(page1);

  const page2 = await addPlayer(browser, gameId as string);
  const page3 = await addPlayer(browser, gameId as string);
  const page4 = await addPlayer(browser, gameId as string);

  await seatPlayer(page1, "player1Name", "north");
  await seatPlayer(page2, "player2Name", "east");
  await seatPlayer(page3, "player3Name", "south");
  await seatPlayer(page4, "player4Name", "west");

  logger("begin game");
  await page1.click(BUTTON_BEGIN_GAME);

  await checkPlayerCards(page1, PLAYER1CARDS);
  await checkPlayerCards(page2, PLAYER2CARDS);
  await checkPlayerCards(page3, PLAYER3CARDS);
  await checkPlayerCards(page4, PLAYER4CARDS);

  await bid(page1, [1, "NO_TRUMPS"])
  await bid(page2, [2, "NO_TRUMPS"])
  await bid(page3, [3, "NO_TRUMPS"])
  await bid(page4, [4, "NO_TRUMPS"])

  console.log("End game\n\n\n");

  // await browser.close();
})();
