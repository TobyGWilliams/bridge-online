const WebSocket = require("ws");

const sendAction = require("./modules/send-action");

const port = 7777;

let gameId = null;

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

const connection1MessageHandler = (user) => (message) => {
  const { action, data } = JSON.parse(message);

  if (action === "GAME_JOINED") {
    gameId = data.gameId;
  }

  if (action == "STATE") {
    console.log(user, action, data);
  }
};

const playerCreateGame = async () => {
  const connection1 = await newConnection();

  connection1.on("message", connection1MessageHandler("player1"));

  sendAction(connection1, "NEW_SESSION");

  await wait(1000);

  sendAction(connection1, "CREATE_GAME");

  await wait(1000);

  if (!gameId) {
    throw new Error("Didn't receieve a game id back");
  }

  sendAction(connection1, "NEW_PLAYER", { name: "Jamie", position: "north" });
};

const secondPlayerJoins = async () => {
  const connection2 = await newConnection();

  connection2.on("message", connection1MessageHandler("player2"));

  sendAction(connection2, "NEW_SESSION");

  await wait(1000);

  sendAction(connection2, "JOIN_GAME", { gameId });

  await wait(1000);

  sendAction(connection2, "NEW_PLAYER", { name: "Toby", position: "south" });
};

const doTheThings = async () => {
  await playerCreateGame();

  await secondPlayerJoins();
};

setTimeout(doTheThings, 1000);
