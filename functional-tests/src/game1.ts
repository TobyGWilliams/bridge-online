import { Browser } from "playwright";
import assert from "assert";

import createGame from "./sagas/create-game";
import seatPlayer from "./sagas/seat-player";

import addPlayer from "./util/add-player";
import bid from "./util/bid";
import wait from "./util/wait";
import getCards from "./util/get-cards";

import {
  BUTTON_BEGIN_GAME,
  BUTTON_PASS,
  GAME_STATE_LEADING_FIRST_CARD,
  PLAYER1CARDS,
  PLAYER2CARDS,
  PLAYER3CARDS,
  PLAYER4CARDS,
} from "./constants/selectors";
import getGameState from "./util/get-game-state";

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

  assert(yield getCards(page1), PLAYER1CARDS);
  assert(yield getCards(page2), PLAYER2CARDS);
  assert(yield getCards(page3), PLAYER3CARDS);
  assert(yield getCards(page4), PLAYER4CARDS);

  yield bid(page1, [1, "HEART"]);
  yield bid(page2, [2, "SPADE"]);
  yield bid(page3, [3, "HEART"]);

  yield page4.click(BUTTON_PASS);
  yield page1.click(BUTTON_PASS);
  yield page2.click(BUTTON_PASS);

  assert(yield getGameState(page1), GAME_STATE_LEADING_FIRST_CARD);
  assert(yield getGameState(page2), GAME_STATE_LEADING_FIRST_CARD);
  assert(yield getGameState(page3), GAME_STATE_LEADING_FIRST_CARD);
  assert(yield getGameState(page4), GAME_STATE_LEADING_FIRST_CARD);
  
  // const {
  //   currentBid,
  //   players,
  //   currentPlayer: { connectionId, ...currentPlayer },
  //   declarer,
  //   dummy,
  // } = yield getState(page4);

  // expect(declarer).toEqual("north");
  // expect(dummy).toEqual("south");
  // expect(currentBid).toEqual([3, "HEART"]);
  // expect(players).toMatchSnapshot();
  // expect(currentPlayer).toMatchSnapshot();
}

export default {
  name: "Bid hearts and spades",
  test,
};
