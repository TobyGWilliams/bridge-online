import { Browser } from "playwright";
import { deepStrictEqual } from "assert";

import createGame from "../sagas/create-game";
import seatPlayer from "../sagas/seat-player";

import addPlayer from "../util/add-player";
import bid from "../util/bid";
import wait from "../util/wait";
import getCards from "../util/get-cards";

import {
  BUTTON_BEGIN_GAME,
  BUTTON_PASS,
  GAME_STATE_LEADING_FIRST_CARD,
  PLAYER1CARDS,
  PLAYER2CARDS,
  PLAYER3CARDS,
  PLAYER4CARDS,
} from "../constants/selectors";
import getGameState from "../util/get-game-state";
import getState from "../util/get-state";

const SEED = "this is the game seed";

function* test(browser: Browser) {
  const { page1, gameId } = yield* createGame(browser, SEED);
  yield* seatPlayer(page1, "player1Name", "north");

  const page2 = yield addPlayer(browser, gameId as string);
  yield* seatPlayer(page2, "player2Name", "east");

  const page3 = yield addPlayer(browser, gameId as string);
  yield* seatPlayer(page3, "player3Name", "south");

  const page4 = yield addPlayer(browser, gameId as string);
  yield* seatPlayer(page4, "player4Name", "west");

  yield wait(500);

  yield page1.click(BUTTON_BEGIN_GAME);

  deepStrictEqual(yield getCards(page1), PLAYER1CARDS);
  deepStrictEqual(yield getCards(page2), PLAYER2CARDS);
  deepStrictEqual(yield getCards(page3), PLAYER3CARDS);
  deepStrictEqual(yield getCards(page4), PLAYER4CARDS);

  yield bid(page1, [1, "HEART"]);
  yield bid(page2, [2, "SPADE"]);
  yield bid(page3, [3, "HEART"]);

  yield page4.click(BUTTON_PASS);
  yield page1.click(BUTTON_PASS);
  yield page2.click(BUTTON_PASS);

  yield wait(100);

  deepStrictEqual(yield getGameState(page1), GAME_STATE_LEADING_FIRST_CARD);
  deepStrictEqual(yield getGameState(page2), GAME_STATE_LEADING_FIRST_CARD);
  deepStrictEqual(yield getGameState(page3), GAME_STATE_LEADING_FIRST_CARD);
  deepStrictEqual(yield getGameState(page4), GAME_STATE_LEADING_FIRST_CARD);

  const { currentBid, declarer, dummy } = yield getState(page4);

  deepStrictEqual(declarer, "north");
  deepStrictEqual(dummy, "south");
  deepStrictEqual(currentBid, [3, "HEART"]);
}

export default {
  name: "Bid hearts and spades",
  test,
};
