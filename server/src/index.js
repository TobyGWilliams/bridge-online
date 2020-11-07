const WebSocket = require("ws");
const express = require("express");
const { v4: uuid } = require("uuid");

const Game = require("./modules/game");

console.clear();
console.log("-----------------------------");

const gameActions = Object.entries(Game.GAME_ACTIONS).map(
  ([key, value]) => value
);

const findGame = (games, gameId) =>
  games.find((game) => game.gameId === gameId);

const app = express();
const port = 7777;

const games = [];

const server = new WebSocket.Server({ server: app.listen(port) });

const messageHandler = (connectionId, socket) => (message) => {
  const { action, data } = JSON.parse(message);

  if (gameActions.includes(action)) {
    const game = findGame(games, data.gameId);

    if (!game.callbacks[connectionId]) {
      console.error("game not associated with player");
      return;
    }

    game.action(connectionId, action, data);
  }

  if (action === "CREATE_GAME") {
    console.log({ action, data });
    const game = new Game(data.seed);
    const messageCallback = (message) => socket.send(message);

    games.push(game);
    game.addConnection(connectionId, messageCallback);
  }

  if (action === "JOIN_GAME") {
    const game = findGame(games, data.gameId);

    if (!game) return;

    const messageCallback = (message) => socket.send(message);
    game.addConnection(connectionId, messageCallback);
  }

  // if (action === "NEW_SESSION") {
  //   sendAction(socket, "SET_CONNECTION_ID", { connectionId });
  // }
};

server.on("connection", (socket) => {
  const connectionId = uuid();

  socket.on("message", messageHandler(connectionId, socket));
});
