import { Browser } from "playwright";
import { deepStrictEqual } from "assert";

import createGame from "../sagas/create-game";
import seatPlayer from "../sagas/seat-player";

import addPlayer from "../util/add-player";
import bid from "../util/bid";
import wait from "../util/wait";
import getCards from "../util/get-cards";
import getGameState from "../util/get-game-state";
import getState from "../util/get-state";

import {
  BUTTON_BEGIN_GAME,
  BUTTON_PASS,
  GAME_STATE_LEADING_FIRST_CARD,
} from "../constants/selectors";

const SEED = "I am a value";
const PLAYER1CARDS =
  '[["7","HEART"],["4","DIAMOND"],["10","CLUB"],["7","DIAMOND"],["4","CLUB"],["3","HEART"],["9","CLUB"],["2","SPADE"],["3","DIAMOND"],["9","HEART"],["ACE","DIAMOND"],["QUEEN","CLUB"],["ACE","HEART"]]';
const PLAYER2CARDS =
  '[["3","CLUB"],["8","CLUB"],["QUEEN","HEART"],["JACK","SPADE"],["2","CLUB"],["8","SPADE"],["JACK","CLUB"],["8","DIAMOND"],["9","SPADE"],["7","CLUB"],["10","DIAMOND"],["2","DIAMOND"],["QUEEN","DIAMOND"]]';
const PLAYER3CARDS =
  '[["KING","DIAMOND"],["10","SPADE"],["5","HEART"],["5","CLUB"],["6","CLUB"],["4","SPADE"],["7","SPADE"],["3","SPADE"],["8","HEART"],["5","DIAMOND"],["5","SPADE"],["KING","CLUB"],["6","SPADE"]]';
const PLAYER4CARDS =
  '[["QUEEN","SPADE"],["KING","HEART"],["JACK","HEART"],["ACE","CLUB"],["ACE","SPADE"],["6","HEART"],["6","DIAMOND"],["9","DIAMOND"],["KING","SPADE"],["10","HEART"],["JACK","DIAMOND"],["2","HEART"],["4","HEART"]]';

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
  yield bid(page2, [3, "SPADE"]);
  yield bid(page3, [4, "HEART"]);
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
  deepStrictEqual(currentBid, [4, "HEART"]);
}

export default {
  name: "A different seed",
  test,
};
