import sendAction from "./send-action";

const port = 7777;

const delay = 200;

let gameId = null;

let gameState = null;

console.clear();

const wait = (delay) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(), delay);
  });

const newConnection = () =>
  new Promise((resolve) => {
    const socket = new WebSocket(`ws://localhost:${port}`);

    socket.onopen = () => {
      resolve(socket);
    };
  });

const waitForGameState = (state) =>
  new Promise((resolve) => {
    const interval = setInterval(() => {
      if (gameState === state) {
        clearInterval(interval);
        resolve();
      }
    }, delay);
  });

const connectionMessageHandler = (user, playerStateCallback = () => {}) => ({
  data: message,
}) => {
  const { action, data } = JSON.parse(message);

  if (action === "STATE") {
    gameState = data.state;
    gameId = data.gameId;
    playerStateCallback(data);
  }
};

const firstPlayer = async (name, position, playerStateCallback) => {
  const connection = await newConnection();

  connection.onmessage = connectionMessageHandler(name, playerStateCallback);

  sendAction(connection, "NEW_SESSION");

  await wait(delay);

  sendAction(connection, "CREATE_GAME");

  await wait(delay);

  if (!gameId) {
    throw new Error("Didn't receieve a game id back");
  }

  sendAction(connection, "NEW_PLAYER", { name, position });

  return connection;
};

const playerJoins = async (name, position, playerStateCallback) => {
  const connection = await newConnection();

  connection.onmessage = connectionMessageHandler(name, playerStateCallback);

  sendAction(connection, "NEW_SESSION");

  await wait(delay);

  sendAction(connection, "JOIN_GAME", { gameId });

  await wait(delay);

  sendAction(connection, "NEW_PLAYER", { name, position });

  return connection;
};

const doTheThings = async (
  setPlayer1State,
  setPlayer2State,
  setPlayer3State,
  setPlayer4State
) => {
  const jamie = await firstPlayer("Jamie", "south", setPlayer1State);
  const toby = await playerJoins("Toby", "north", setPlayer2State);
  const jessica = await playerJoins("Jessica", "east", setPlayer3State);
  const david = await playerJoins("David", "west", setPlayer4State);

  // await wait(delay);

  // sendAction(jamie, "BEGIN_GAME");

  // await waitForGameState("BIDDING");

  // sendAction(toby, "BID", { bid: [2, "DIAMOND"] });

  // await wait(delay);

  // sendAction(jessica, "BID", { bid: [3, "DIAMOND"] });

  // await wait(delay);

  // sendAction(jamie, "BID", { bid: [4, "DIAMOND"] });

  // await wait(delay);

  // sendAction(david, "BID", { bid: [5, "DIAMOND"] });
};

export default doTheThings;
