import WebSocket from "ws";
import express from "express";
import { v4 as uuid } from "uuid";

// import Game from "./modules/game";
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
// const games: Array<Game> = [];

const server = new WebSocket.Server({ server: app.listen(port) });

const messageHandler = (socket: WebSocket) => (message: string) => {
  const { action, data, sessionId } = JSON.parse(message);

  if (!sessionId) {
    const sessionId = uuid();
    sessions.set(sessionId, "hello world");

    console.log(sessions);

    sendAction(socket, "NEW_SESSION", { sessionId });
    return;
  }

  const session = sessions.get(sessionId);

  console.log(session);
  console.log(action, data);
};

server.on("connection", (socket) => {
  socket.on("message", messageHandler(socket));
});
