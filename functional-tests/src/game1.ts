import { Browser } from "playwright";

import createGame from "./sagas/create-game";
import seatPlayer from "./sagas/seat-player";

import addPlayer from "./util/add-player";
import bid from "./util/bid";
import wait from "./util/wait";

import { BUTTON_BEGIN_GAME, BUTTON_PASS } from "./constants/selectors";

const SEED = "this is the game seed";

export default function* (browser: Browser) {
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

  // expect(yield getCards(page1)).toEqual(PLAYER1CARDS);
  // expect(yield getCards(page2)).toEqual(PLAYER2CARDS);
  // expect(yield getCards(page3)).toEqual(PLAYER3CARDS);
  // expect(yield getCards(page4)).toEqual(PLAYER4CARDS);
  yield bid(page1, [1, "HEART"]);
  yield bid(page2, [2, "SPADE"]);
  yield bid(page3, [3, "HEART"]);

  yield page4.click(BUTTON_PASS);
  yield page1.click(BUTTON_PASS);
  yield page2.click(BUTTON_PASS);

  // yield wait(500);

  // // expect(yield getGameState(page1)).toEqual(GAME_STATE_LEADING_FIRST_CARD);
  // // expect(yield getGameState(page2)).toEqual(GAME_STATE_LEADING_FIRST_CARD);
  // // expect(yield getGameState(page3)).toEqual(GAME_STATE_LEADING_FIRST_CARD);
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
