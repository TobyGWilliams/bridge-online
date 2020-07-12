const WebSocket = require("ws");

const port = 7777;

let handshake =  5 

const connect = () => {
  const socket = new WebSocket(`ws://localhost:${port}`);
  socket.onopen = () => {
    console.log("connection");
    const data = { action: "NEW_SESSION" };
    socket.send(JSON.stringify(data));
  };
};

setTimeout(connect, 1000);
