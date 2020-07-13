const WebSocket = require("ws");

const sendAction = require("./modules/send-action");

const port = 7777;

const connect = () => {
  const socket = new WebSocket(`ws://localhost:${port}`);
  socket.onopen = () => {
    sendAction(socket, "NEW_SESSION");
  };
};

const connectThatJoinsGame = (gameId) => {
  const socket = new WebSocket(`ws://localhost:${port}`);

  const onMessage = (message) => {
    const { action, data } = JSON.parse(message);

    console.log(action);

    if (action === "GAME_CREATED") {
      console.log(data);
      sendAction(socket, "NEW_PLAYER", { name: "Jamie", position: "north" });
    }
  };

  socket.on("message", onMessage);

  socket.onopen = () => {
    sendAction(socket, "NEW_SESSION");

    setTimeout(() => {
      sendAction(socket, "JOIN_GAME", { gameId });
    }, 3000);
  };
};

const connectThatCreatesGame = () => {
  const socket = new WebSocket(`ws://localhost:${port}`);

  const onMessage = (message) => {
    const { action, data } = JSON.parse(message);

    if (action === "GAME_JOINED") {
      connectThatJoinsGame(data.gameId);
      sendAction(socket, "NEW_PLAYER", { name: "Toby", position: "south" });
    }
  };

  socket.on("message", onMessage);

  socket.onopen = () => {
    sendAction(socket, "NEW_SESSION");

    setTimeout(() => {
      sendAction(socket, "CREATE_GAME");
    }, 3000);
  };
};

setTimeout(connectThatCreatesGame, 1000);
// setTimeout(connect, 2000);
