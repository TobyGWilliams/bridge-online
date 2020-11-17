import { Browser, chromium } from "playwright";

import addPlayer from "./util/add-player";
import seatPlayer from "./sagas/seat-player";
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
import createGame from "./sagas/create-game";

const SEED = "this is the game seed";

export default function* (browser: Browser) {
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

  // expect(yield getCards(page1)).toEqual(PLAYER1CARDS);
  // expect(yield getCards(page2)).toEqual(PLAYER2CARDS);
  // expect(yield getCards(page3)).toEqual(PLAYER3CARDS);
  // expect(yield getCards(page4)).toEqual(PLAYER4CARDS);
  yield bid(page1, [1, "NO_TRUMPS"]);
  yield bid(page2, [2, "NO_TRUMPS"]);
  yield bid(page3, [3, "NO_TRUMPS"]);
  yield bid(page4, [4, "NO_TRUMPS"]);

  yield page1.click(BUTTON_PASS);
  yield page2.click(BUTTON_PASS);
  yield page3.click(BUTTON_PASS);

  yield wait(500);

  // expect(yield getGameState(page1)).toEqual(GAME_STATE_LEADING_FIRST_CARD);
  // expect(yield getGameState(page2)).toEqual(GAME_STATE_LEADING_FIRST_CARD);
  // expect(yield getGameState(page3)).toEqual(GAME_STATE_LEADING_FIRST_CARD);
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
};
