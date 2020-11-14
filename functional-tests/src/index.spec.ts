import { chromium } from "playwright";

import addPlayer from "./util/add-player";
import seatPlayer from "./util/seat-player";
import getGameId from "./util/get-game-id";
import bid from "./util/bid";
import getGameState from "./util/get-game-state";
import getCards from "./util/get-cards";
import getState from "./util/get-state";
import wait from "./util/wait";

import { writeLog } from "./util/logger";

import {
  BUTTON_BEGIN_GAME,
  CREATE_GAME,
  INPUT_GAME_SEED,
  PLAYER1CARDS,
  PLAYER2CARDS,
  PLAYER3CARDS,
  PLAYER4CARDS,
  URL,
  BUTTON_PASS,
  GAME_STATE_LEADING_FIRST_CARD,
} from "./util/constants";

const SEED = "this is the game seed";

test("a game", async () => {
  const browser = await chromium.launch({
    headless: false,
    timeout: 1000,
    logger: {
      isEnabled: () => true,
      log: (name, severity, message, args) => writeLog(message as string, 2),
    },
  });

  try {
    const page1 = await browser.newPage();

    await page1.goto(URL);

    await page1.waitForSelector(CREATE_GAME);
    await page1.focus(INPUT_GAME_SEED);
    await page1.keyboard.type(SEED);
    await page1.click(CREATE_GAME);

    await wait(500);
    const gameId = await getGameId(page1);

    expect(gameId).not.toEqual("");

    const page2 = await addPlayer(browser, gameId as string);
    const page3 = await addPlayer(browser, gameId as string);
    const page4 = await addPlayer(browser, gameId as string);

    await wait(500);

    await seatPlayer(page1, "player1Name", "north");
    await seatPlayer(page2, "player2Name", "east");
    await seatPlayer(page3, "player3Name", "south");
    await seatPlayer(page4, "player4Name", "west");

    await page1.click(BUTTON_BEGIN_GAME);

    expect(await getCards(page1)).toEqual(PLAYER1CARDS);
    expect(await getCards(page2)).toEqual(PLAYER2CARDS);
    expect(await getCards(page3)).toEqual(PLAYER3CARDS);
    expect(await getCards(page4)).toEqual(PLAYER4CARDS);

    await bid(page1, [1, "NO_TRUMPS"]);
    await bid(page2, [2, "NO_TRUMPS"]);
    await bid(page3, [3, "NO_TRUMPS"]);
    await bid(page4, [4, "NO_TRUMPS"]);

    await page1.click(BUTTON_PASS);
    await page2.click(BUTTON_PASS);
    await page3.click(BUTTON_PASS);

    await wait(500);

    expect(await getGameState(page1)).toEqual(GAME_STATE_LEADING_FIRST_CARD);
    expect(await getGameState(page2)).toEqual(GAME_STATE_LEADING_FIRST_CARD);
    expect(await getGameState(page3)).toEqual(GAME_STATE_LEADING_FIRST_CARD);

    const {
      currentBid,
      players,
      currentPlayer: { connectionId, ...currentPlayer },
      declarer,
      dummy,
    } = await getState(page4);

    expect(declarer).toEqual("west");
    expect(dummy).toEqual("east");
    expect(currentBid).toEqual([4, "NO_TRUMPS"]);
    expect(players).toMatchSnapshot();
    expect(currentPlayer).toMatchSnapshot();

    // await browser.close();
    return;
  } catch (err) {
    // browser.close();
    throw err;
    return;
  }
});
