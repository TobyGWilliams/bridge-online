const { v4: uuid } = require("uuid");

const sendAction = require("./send-action");

const sendToAll = (connections, callback) => {
  Object.entries(connections).forEach(callback);
};

class Game {
  constructor() {
    this.gameId = uuid();
    this.sockets = {};
    this.players = {};
  }

  updateClientState() {
    sendToAll(this.sockets, ([key, connection]) => {
      const players = Object.entries(
        this.players
      ).map(([playerKey, { connectionId, ...data } = {}]) => [
        playerKey,
        { ...data, isUser: connectionId === key },
      ]);

      const data = { players: Object.fromEntries(players) };

      sendAction(connection, "STATE", data);
    });
  }

  addConnection(connectionId, socket) {
    this.sockets[connectionId] = socket;

    socket.on("message", (message) => {
      const { action, data } = JSON.parse(message);

      if (action === "NEW_PLAYER") {
        this.players = {
          ...this.players,
          [data.position]: { name: data.name, connectionId },
        };
        this.updateClientState();
      }
    });

    sendAction(socket, "GAME_JOINED", { gameId: this.gameId });
  }
}

module.exports = Game;
