import WebSocket from "ws";
import express from "express";
import { v4 as uuid } from "uuid";

import Game, { GameCallback } from "./modules/game";
import sendAction from "./modules/send-action";

console.clear();

// const gameActions = Object.entries(Game.GAME_ACTIONS).map(
//   ([key, value]) => value
// );

// const findGame = (games: Array<Game>, gameId: string) =>
//   games.find((game) => game.gameId === gameId);

const app = express();
const port = 7777;

const sessions = new Map<string, string>();
const games: Array<Game> = [];

const server = new WebSocket.Server({ server: app.listen(port) });

const messageHandler = (socket: WebSocket) => (message: string) => {
  const { action, data, sessionId } = JSON.parse(message);

  if (!sessionId) {
    const sessionId = uuid();
    sessions.set(sessionId, "hello world");

    sendAction(socket, "NEW_SESSION", { sessionId });

    return;
  }

  const session = sessions.get(sessionId);

  if (!session && action === "RESUME_SESSION") {
    const sessionId = uuid();
    sessions.set(sessionId, "hello world");

    sendAction(socket, "NEW_SESSION", { sessionId });

    return;
  }

  if (!session && action !== "RESUME_SESSION") {
    // sessionId didn't match an active session and it wasn't a resume action
    return;
  }

  if (action === "RESUME_SESSION") {
    // we should see if the session is associated with a live game
    return;
  }

  if (action === "CREATE_GAME") {
    const gameMessageCallback: GameCallback = (message) => {
      console.log("send mesasage", message);
    };
    const game = new Game(data.seed, gameMessageCallback);
    game.action()
    console.log(action, data, game);
  }
};

server.on("connection", (socket) => {
  socket.on("message", messageHandler(socket));
});
