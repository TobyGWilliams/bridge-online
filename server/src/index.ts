import WebSocket from "ws";
import express from "express";
import { v4 as uuid } from "uuid";

import Game, { GameCallback } from "./modules/game";
import sendAction from "./modules/send-action";
import logger from "./utils/logger";
interface User {
  socket?: WebSocket;
  game?: Game;
}

const app = express();
const port = 7777;

const sessions = new Map<string, User>();
const games = new Map<string, Game>();
const server = new WebSocket.Server({ server: app.listen(port) });
const arrayOfGameActions = Object.values(Game.GAME_ACTIONS);

const gameMessageCallback: GameCallback = (message, sessionId) => {
  const { socket } = sessions.get(sessionId) || {};

  if (!socket) {
    console.log("session didnt exist");
    return;
  }

  sendAction(socket as WebSocket, "STATE", message);
};

const createNewSession = (socket: WebSocket) => {
  const sessionId = uuid();
  sessions.set(sessionId, { socket, game: undefined });

  sendAction(socket, "NEW_SESSION", { sessionId });

  return;
};

const messageHandler = (socket: WebSocket) => (message: string) => {
  const { action, data, sessionId } = JSON.parse(message);

  if (!sessionId) {
    createNewSession(socket);
    return;
  }

  const session = sessions.get(sessionId);

  if (!session) {
    if (action === "RESUME_SESSION") {
      createNewSession(socket);
      return;
    }
    console.log("no session");
    // sessionId didn't match an active session and it wasn't a resume action
    return;
  }

  if (action === "RESUME_SESSION") {
    if (!session.socket) {
      sessions.set(sessionId, { ...session, socket });
    }

    if (session.game) {
      session.game.updateClientsState();
      return;
    }

    console.log("no existing game!");
  }

  if (action === "CREATE_GAME") {
    const session = sessions.get(sessionId);

    if (!session) {
      console.log("no session found", action);
      return;
    }

    if (session.game) {
      session.game.updateClientsState();
      return;
    }

    const gameId = uuid();
    const game = new Game(gameId, data.seed, gameMessageCallback);

    games.set(gameId, game);
    game.addUser(sessionId);

    sessions.set(sessionId, { ...session, game });

    return;
  }

  if (session.game && arrayOfGameActions.includes(action)) {
    session.game.gameAction(sessionId, action, data);
    return;
  }
};

const closeHandler = () => {
  sessions.forEach(({ socket, ...session }, key) => {
    sessions.set(key, { ...session });
  });
};

server.on("connection", (socket) => {
  socket.on("message", messageHandler(socket));
  socket.on("close", closeHandler);
});
