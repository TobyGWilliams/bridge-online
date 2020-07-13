const WebSocket = require("ws");
const express = require("express");
const { v4: uuid } = require("uuid");

const Game = require("./modules/game");
const sendAction = require("./modules/send-action");

const app = express();
const port = 7777;

const games = [];

const server = new WebSocket.Server({ server: app.listen(port) });

const messageHandler = (connectionId, socket) => (message) => {
  const { action, data } = JSON.parse(message);

  if (action === "CREATE_GAME") {
    const game = new Game();
    game.addConnection(connectionId, socket);
    games.push(game);
  }

  if (action === "NEW_SESSION") {
    sendAction(socket, "SET_CONNECTION_ID", { connectionId });
  }

  if (action === "JOIN_GAME") {
    const game = games.find((game) => game.gameId === data.gameId);
    game.addConnection(connectionId, socket);
  }
};

server.on("connection", (socket) => {
  const connectionId = uuid();

  socket.on("message", messageHandler(connectionId, socket));
});
