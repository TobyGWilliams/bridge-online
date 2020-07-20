const WebSocket = require("ws");

const sendAction = require("./modules/send-action");

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

const waitFoGameState = (state) =>
  new Promise((resolve) => {
    const interval = setInterval(() => {
      if (gameState === state) {
        clearInterval(interval);
        resolve();
      }
    }, delay);
  });

const connectionMessageHandler = (user) => (message) => {
  const { action, data } = JSON.parse(message);

  if (action == "STATE") {
    gameState = data.state;
    gameId = data.gameId;
    console.log(user, "\n", data);
  }
};

const firstPlayer = async (name, position) => {
  const connection = await newConnection();

  connection.on("message", connectionMessageHandler(name));

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

const playerJoins = async (name, position) => {
  const connection = await newConnection();

  connection.on("message", connectionMessageHandler(name));

  sendAction(connection, "NEW_SESSION");

  await wait(delay);

  sendAction(connection, "JOIN_GAME", { gameId });

  await wait(delay);

  sendAction(connection, "NEW_PLAYER", { name, position });

  return connection;
};

const doTheThings = async () => {
  const jamie = await firstPlayer("Jamie", "south");
  const toby = await playerJoins("Toby", "north");
  const jessica = await playerJoins("Jessica", "east");
  const david = await playerJoins("David", "west");

  await wait(delay);

  sendAction(jamie, "BEGIN_GAME");

  await waitFoGameState("BIDDING");

  sendAction(toby, "BID", { bid: [2, "DIAMOND"] });

  await wait(delay)

  sendAction(jessica, "BID", { bid: [3, "DIAMOND"] });
};

setTimeout(doTheThings, 2000);
