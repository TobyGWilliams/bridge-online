const puppeteer = require("puppeteer");

const BUTTON_JOIN_GAME = 'button[data-test="join-game"]';
const BUTTON_NEW_PLAYER = 'button[data-test="new-player-submit"]';
const BUTTON_BEGIN_GAME = 'button[data-test="begin-game-button"]';
const BUTTON_PLACE_BID = 'button[data-test="place-bid"]';
const CREATE_GAME = 'button[data-test="create-game"]';
const INPUT_GAME_ID = 'input[data-test="input-game-id"]';
const INPUT_PLAYER_NAME = 'input[data-test="player-name-input"]';
const INPUT_GAME_SEED = 'input[data-test="input-seed"]';
const SELECT_PLAYER_DIRECTION = 'select[data-test="player-direction"]';

const PLAYER1CARDS =
  '[["5","CLUB"],["3","HEART"],["6","CLUB"],["9","SPADE"],["7","DIAMOND"],["7","SPADE"],["2","HEART"],["KING","SPADE"],["5","DIAMOND"],["10","SPADE"],["4","DIAMOND"],["5","HEART"],["8","HEART"]]';
const PLAYER2CARDS =
  '[["3","CLUB"],["3","SPADE"],["8","SPADE"],["6","HEART"],["ACE","DIAMOND"],["QUEEN","CLUB"],["JACK","HEART"],["3","DIAMOND"],["10","DIAMOND"],["9","DIAMOND"],["KING","CLUB"],["4","SPADE"],["8","DIAMOND"]]';
const PLAYER3CARDS =
  '[["JACK","SPADE"],["9","CLUB"],["KING","DIAMOND"],["ACE","HEART"],["7","HEART"],["QUEEN","HEART"],["JACK","DIAMOND"],["4","HEART"],["6","DIAMOND"],["10","HEART"],["7","CLUB"],["8","CLUB"],["5","SPADE"]]';
const PLAYER4CARDS =
  '[["JACK","CLUB"],["2","SPADE"],["ACE","SPADE"],["2","DIAMOND"],["4","CLUB"],["9","HEART"],["QUEEN","SPADE"],["10","CLUB"],["KING","HEART"],["2","CLUB"],["ACE","CLUB"],["6","SPADE"],["QUEEN","DIAMOND"]]';

const URL = "http://localhost:3000";

const getBidButtonByBid = (bid) =>
  `button[data-test="place-bid"][data-test-bid="${JSON.stringify(bid).replace(
    /\"/g,
    '\\"'
  )}"]`;

const getGameId = async (page) =>
  page.evaluate(() =>
    document.querySelector('meta[name="game-id"]').getAttribute("content")
  );

const getCards = async (page) =>
  page.evaluate(() => {
    console.log(document.querySelector('meta[name="player-cards"]'));
    return document
      .querySelector('meta[name="player-cards"]')
      .getAttribute("content");
  });

const checkPlayerCards = async (page, PLAYERCARDS) => {
  const playerCards = await getCards(page);

  if (playerCards !== PLAYERCARDS) {
    console.log(`player cards:\n ${playerCards} \n ${PLAYERCARDS}`);
    throw new Error("player cards incorrect!");
  }
};

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
  const browser = await puppeteer.launch({ headless: true, devtools: true });
  const page1 = await browser.newPage();

  await page1.goto(URL);

  await page1.waitForSelector(CREATE_GAME, {
    visible: true,
  });

  await page1.focus(INPUT_GAME_SEED);
  await page1.keyboard.type("this is the game seed");

  await page1.click(CREATE_GAME);

  const gameId = await getGameId(page1);

  const page2 = await addPlayer(browser, gameId);
  const page3 = await addPlayer(browser, gameId);
  const page4 = await addPlayer(browser, gameId);

  await seatPlayer(page1, "player1Name", "north");
  await seatPlayer(page2, "player2Name", "east");
  await seatPlayer(page3, "player3Name", "south");
  await seatPlayer(page4, "player4Name", "west");

  await page1.bringToFront();

  await page1.click(BUTTON_BEGIN_GAME);

  await checkPlayerCards(page1, PLAYER1CARDS);

  await page2.bringToFront();
  await checkPlayerCards(page2, PLAYER2CARDS);

  await page3.bringToFront();
  await checkPlayerCards(page3, PLAYER3CARDS);

  await page4.bringToFront();
  await checkPlayerCards(page4, PLAYER4CARDS);

  await page1.click(getBidButtonByBid([1, "NO_TRUMPS"]));
  await page2.click(getBidButtonByBid([2, "NO_TRUMPS"]));
  await page3.click(getBidButtonByBid([3, "NO_TRUMPS"]));
  await page4.click(getBidButtonByBid([4, "NO_TRUMPS"]));

  await browser.close();
})();
