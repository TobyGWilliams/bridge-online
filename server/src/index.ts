import WebSocket from "ws";
import express from "express";
import { v4 as uuid } from "uuid";

import Game from "./modules/game";

console.clear();

const gameActions = Object.entries(Game.GAME_ACTIONS).map(
  ([key, value]) => value
);

const findGame = (games: Array<Game>, gameId: string) =>
  games.find((game) => game.gameId === gameId);

const app = express();
const port = 7777;

const games: Array<Game> = [];

const server = new WebSocket.Server({ server: app.listen(port) });

const messageHandler = (connectionId: string, socket: WebSocket) => (
  message: string
) => {
  const { action, data } = JSON.parse(message);

  if (gameActions.includes(action)) {
    const game = findGame(games, data.gameId);

    if (!game) {
      return;
    }

    if (!game.callbacks[connectionId]) {
      console.error("game not associated with player");
      return;
    }

    game.action(connectionId, action, data);
  }

  if (action === "CREATE_GAME") {
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

  if (action === "NEW_SESSION") {
    sendAction(socket, "SET_CONNECTION_ID", { connectionId });
  }
};

server.on("connection", (socket) => {
  const connectionId = uuid();

  socket.on("message", messageHandler(connectionId, socket));
});
