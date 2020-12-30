import WebSocket from "ws";
import express from "express";
import { v4 as uuid } from "uuid";

import sendAction from "./utils/send-action";
import store from "./redux/create-store";

store.subscribe(() => {
  console.log("store updated", store.getState());
});

interface User {
  socket?: WebSocket;
}

const app = express();
const port = 7777;

const sessions = new Map<string, User>();
const server = new WebSocket.Server({ server: app.listen(port) });

const createSession = (socket: WebSocket) => {
  const sessionId = uuid();
  sessions.set(sessionId, { socket });

  sendAction(socket, "SET_SESSION_ID", { sessionId });

  return;
};

const messageHandler = (socket: WebSocket) => (message: string) => {
  const { action, data, sessionId } = JSON.parse(message);

  if (!sessionId) {
    createSession(socket);
    return;
  }

  const session = sessions.get(sessionId);

  if (action === "RESUME_SESSION") {
    if (!session) {
      createSession(socket);
      return;
    }

    if (!session.socket) {
      sessions.set(sessionId, { ...session, socket });
    }

    // sessionId didn't match an active session and it wasn't a resume action
    return;
  }

  store.dispatch({ type: action, data });
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
