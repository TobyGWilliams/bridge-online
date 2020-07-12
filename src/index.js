const WebSocket = require("ws");
const express = require("express");
const { v4: uuid } = require("uuid");

const app = express();
const port = 7777;

const clients = [];

const server = new WebSocket.Server({ server: app.listen(port) });

const messageHandler = (connectionId) => (message) => {
  console.log(connectionId, message);
};

server.on("connection", (socket) => {
  const connectionId = uuid();
  clients.push(connectionId);

  socket.on("message", messageHandler(connectionId));
});
