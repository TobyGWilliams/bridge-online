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
  const { page1, gameId } = await createGame(browser, SEED);
  await seatPlayer(page1, "player1Name", "north");

  const page2 = await addPlayer(browser, gameId as string);
  await seatPlayer(page2, "player2Name", "east");

  const page3 = await addPlayer(browser, gameId as string);
  await seatPlayer(page3, "player3Name", "south");

  const page4 = await addPlayer(browser, gameId as string);
  await seatPlayer(page4, "player4Name", "west");

  await wait(500);

  await page1.click(BUTTON_BEGIN_GAME);

  // expect(await getCards(page1)).toEqual(PLAYER1CARDS);
  // expect(await getCards(page2)).toEqual(PLAYER2CARDS);
  // expect(await getCards(page3)).toEqual(PLAYER3CARDS);
  // expect(await getCards(page4)).toEqual(PLAYER4CARDS);

  await bid(page1, [1, "HEART"]);
  await bid(page2, [2, "SPADE"]);
  await bid(page3, [3, "HEART"]);

  await page4.click(BUTTON_PASS);
  await page1.click(BUTTON_PASS);
  await page2.click(BUTTON_PASS);

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

  // expect(declarer).toEqual("north");
  // expect(dummy).toEqual("south");
  // expect(currentBid).toEqual([3, "HEART"]);
  // expect(players).toMatchSnapshot();
  // expect(currentPlayer).toMatchSnapshot();
};
