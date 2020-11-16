import { Browser, chromium } from "playwright";

import addPlayer from "./util/add-player";
import seatPlayer from "./util/seat-player";
import bid from "./util/bid";
import getGameState from "./util/get-game-state";
import getCards from "./util/get-cards";
import getState from "./util/get-state";
import wait from "./util/wait";

import writeLog from "./logger";

import {
  BUTTON_BEGIN_GAME,
  PLAYER1CARDS,
  PLAYER2CARDS,
  PLAYER3CARDS,
  PLAYER4CARDS,
  BUTTON_PASS,
  GAME_STATE_LEADING_FIRST_CARD,
} from "./constants/selectors";
import createGame from "./util/create-game";

const SEED = "this is the game seed";

export default async (browser: Browser) => {
  const { gameId, page1 } = await createGame(browser, SEED);

  const page2 = await addPlayer(browser, gameId as string);
  const page3 = await addPlayer(browser, gameId as string);
  const page4 = await addPlayer(browser, gameId as string);

  await wait(500);

  await seatPlayer(page1, "player1Name", "north");
  await seatPlayer(page2, "player2Name", "east");
  await seatPlayer(page3, "player3Name", "south");
  await seatPlayer(page4, "player4Name", "west");

  await page1.click(BUTTON_BEGIN_GAME);

  // expect(await getCards(page1)).toEqual(PLAYER1CARDS);
  // expect(await getCards(page2)).toEqual(PLAYER2CARDS);
  // expect(await getCards(page3)).toEqual(PLAYER3CARDS);
  // expect(await getCards(page4)).toEqual(PLAYER4CARDS);

  await bid(page1, [1, "NO_TRUMPS"]);
  await bid(page2, [2, "NO_TRUMPS"]);
  await bid(page3, [3, "NO_TRUMPS"]);
  await bid(page4, [4, "NO_TRUMPS"]);

  await page1.click(BUTTON_PASS);
  await page2.click(BUTTON_PASS);
  await page3.click(BUTTON_PASS);

  await wait(500);

  // expect(await getGameState(page1)).toEqual(GAME_STATE_LEADING_FIRST_CARD);
  // expect(await getGameState(page2)).toEqual(GAME_STATE_LEADING_FIRST_CARD);
  // expect(await getGameState(page3)).toEqual(GAME_STATE_LEADING_FIRST_CARD);

  const {
    currentBid,
    players,
    currentPlayer: { connectionId, ...currentPlayer },
    declarer,
    dummy,
  } = await getState(page4);

  // expect(declarer).toEqual("west");
  // expect(dummy).toEqual("east");
  // expect(currentBid).toEqual([4, "NO_TRUMPS"]);
  // expect(players).toMatchSnapshot();
  // expect(currentPlayer).toMatchSnapshot();

  // await browser.close();
};
