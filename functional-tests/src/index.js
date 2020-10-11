const puppeteer = require("puppeteer");

const BUTTON_JOIN_GAME = 'button[data-test="join-game"]';
const BUTTON_NEW_PLAYER = 'button[data-test="new-player-submit"]';
const BUTTON_BEGIN_GAME = 'button[data-test="begin-game-button"]';
const CREATE_GAME = 'button[data-test="create-game"]';
const INPUT_GAME_ID = 'input[data-test="input-game-id"]';
const INPUT_PLAYER_NAME = 'input[data-test="player-name-input"]';
const SELECT_PLAYER_DIRECTION = 'select[data-test="player-direction"]';
const URL = "http://localhost:3000";

const getGameId = async (page) =>
  page.evaluate(() =>
    document.querySelector('meta[name="game-id"]').getAttribute("content")
  );

const seatPlayer = async (page, playerName, direction) => {
  await page.focus(INPUT_PLAYER_NAME);
  await page.keyboard.type(playerName);

  await page.select(SELECT_PLAYER_DIRECTION, direction);

  await page.click(BUTTON_NEW_PLAYER);
};

const addPlayer = async (browser, gameId) => {
  const page = await browser.newPage();

  await page.goto(URL);

  await page.waitForSelector(CREATE_GAME, {
    visible: true,
  });

  await page.focus(INPUT_GAME_ID);
  await page.keyboard.type(gameId);

  await page.click(BUTTON_JOIN_GAME);

  return page;
};

(async () => {
  const browser = await puppeteer.launch({ headless: false, devtools: true });
  const page1 = await browser.newPage();

  await page1.goto(URL);

  await page1.waitForSelector(CREATE_GAME, {
    visible: true,
  });

  await page1.click(CREATE_GAME);

  const gameId = await getGameId(page1);

  const page2 = await addPlayer(browser, gameId);
  const page3 = await addPlayer(browser, gameId);
  const page4 = await addPlayer(browser, gameId);

  await seatPlayer(page1, "player1Name", "north");
  await seatPlayer(page2, "player2Name", "east");
  await seatPlayer(page3, "player3Name", "south");
  await seatPlayer(page4, "player4Name", "west");

  await page1.click(BUTTON_BEGIN_GAME);

  // await browser.close();
})();
