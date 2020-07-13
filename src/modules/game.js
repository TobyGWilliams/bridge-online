const { v4: uuid } = require("uuid");

const sendAction = require("./send-action");

const messageHandler = (game, connectionId) => (message) => {
  const { action, data } = JSON.parse(message);

  if (action === "NEW_PLAYER") {
    game.players[data.position] = { name: data.name, connectionId };
    console.log(game.players);
  }
};

class Game {
  constructor() {
    this.gameId = uuid();
    this.sockets = {};
    this.players = { north: null, south: null, east: null, west: null };
  }

  addConnection(connectionId, socket) {
    this.sockets[connectionId] = socket;

    socket.on("message", messageHandler(this, connectionId));

    sendAction(socket, "GAME_JOINED", { gameId: this.gameId });
  }
}

module.exports = Game;
