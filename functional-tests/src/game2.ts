import { Browser } from "playwright";
import { deepStrictEqual } from "assert";

import addPlayer from "./util/add-player";
import seatPlayer from "./sagas/seat-player";
import bid from "./util/bid";
import getGameState from "./util/get-game-state";
import getCards from "./util/get-cards";
import getState from "./util/get-state";
import wait from "./util/wait";

import createGame from "./sagas/create-game";

import {
  BUTTON_BEGIN_GAME,
  PLAYER1CARDS,
  PLAYER2CARDS,
  PLAYER3CARDS,
  PLAYER4CARDS,
  BUTTON_PASS,
  GAME_STATE_LEADING_FIRST_CARD,
} from "./constants/selectors";


const SEED = "this is the game seed";

function* test(browser: Browser) {
  const { gameId, page1 } = yield* createGame(browser, SEED);

  const page2 = yield addPlayer(browser, gameId as string);
  const page3 = yield addPlayer(browser, gameId as string);
  const page4 = yield addPlayer(browser, gameId as string);

  yield wait(500);

  yield* seatPlayer(page1, "player1Name", "north");
  yield* seatPlayer(page2, "player2Name", "east");
  yield* seatPlayer(page3, "player3Name", "south");
  yield* seatPlayer(page4, "player4Name", "west");

  yield page1.click(BUTTON_BEGIN_GAME);

  deepStrictEqual(yield getCards(page1), PLAYER1CARDS);
  deepStrictEqual(yield getCards(page2), PLAYER2CARDS);
  deepStrictEqual(yield getCards(page3), PLAYER3CARDS);
  deepStrictEqual(yield getCards(page4), PLAYER4CARDS);

  yield bid(page1, [1, "HEART"]);
  yield bid(page2, [2, "SPADE"]);
  yield bid(page3, [3, "HEART"]);

  yield page1.click(BUTTON_PASS);
  yield page2.click(BUTTON_PASS);
  yield page3.click(BUTTON_PASS);

  yield wait(500);

  deepStrictEqual(yield getGameState(page1), GAME_STATE_LEADING_FIRST_CARD);
  deepStrictEqual(yield getGameState(page2), GAME_STATE_LEADING_FIRST_CARD);
  deepStrictEqual(yield getGameState(page3), GAME_STATE_LEADING_FIRST_CARD);
  deepStrictEqual(yield getGameState(page4), GAME_STATE_LEADING_FIRST_CARD);

  const {
    currentBid,
    players,
    currentPlayer: { connectionId, ...currentPlayer },
    declarer,
    dummy,
  } = yield getState(page4);

  // expect(declarer).toEqual("west");
  // expect(dummy).toEqual("east");
  // expect(currentBid).toEqual([4, "NO_TRUMPS"]);
  // expect(players).toMatchSnapshot();
  // expect(currentPlayer).toMatchSnapshot();
  // yield browser.close();
}

export default {
  name: "Bid trumps",
  test,
};
