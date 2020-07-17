const { v4: uuid } = require("uuid");

const sendAction = require("./send-action");
const { dealCards } = require("./cards");

const SHORT_DELAY = 1000;

const sendToAll = (connections, callback) => {
  Object.entries(connections).forEach(callback);
};

class Game {
  constructor() {
    this.gameId = uuid();
    this.sockets = {};
    this.players = {};
    this.state = "LOBBY";
    this.messageSequence = 1;
    this.currentBid = null;
  }

  updateClientState() {
    sendToAll(this.sockets, ([key, connection]) => {
      const players = Object.entries(this.players).map(
        ([playerKey, { connectionId, cards, ...data } = {}]) => [
          playerKey,
          {
            ...data,
            isUser: connectionId === key,
            cards: connectionId === key ? cards : undefined,
          },
        ]
      );

      const data = {
        players: Object.fromEntries(players),
        gameId: this.gameId,
        state: this.state,
        messageSequence: this.messageSequence,
      };

      this.messageSequence += 1;

      sendAction(connection, "STATE", data);
    });
  }

  dealCards() {
    return new Promise((resolve) => {
      const [hand1, hand2, hand3, hand4] = dealCards();

      this.players = {
        north: { ...this.players.north, cards: hand1 },
        south: { ...this.players.south, cards: hand2 },
        east: { ...this.players.east, cards: hand3 },
        west: { ...this.players.west, cards: hand4 },
      };

      setTimeout(() => {
        this.updateClientState();
        resolve();
      }, SHORT_DELAY);
    });
  }

  startBidding(direction) {
    console.log(direction);
  }

  addConnection(connectionId, socket) {
    this.sockets[connectionId] = socket;

    socket.on("message", async (message) => {
      const { action, data } = JSON.parse(message);

      if (action === "NEW_PLAYER") {
        this.players = {
          ...this.players,
          [data.position]: { name: data.name, connectionId },
        };
        this.updateClientState();
      }

      if (action === "BEGIN_GAME") {
        this.state = "DEALING";
        this.updateClientState();

        await this.dealCards();

        this.state = "BIDDING";
        this.startBidding("north");
      }
    });

    this.updateClientState();
  }
}

module.exports = Game;
