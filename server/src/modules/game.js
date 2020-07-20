const { v4: uuid } = require("uuid");

const sendAction = require("./send-action");
const { contracts, getRemainingContracts } = require("./bids");
const { dealCards } = require("./cards");
const { north, east, south, west } = require("./directions");

const SHORT_DELAY = 1000;

const sendToAll = (connections, callback) => {
  Object.entries(connections).forEach(callback);
};

const iterateOverPlayers = (players, callback) => {
  const playersAsArray = Object.entries(players).map(callback);
  return Object.fromEntries(playersAsArray);
};

const getPlayer = (players, connectionId) => {
  const [direction] = Object.entries(players).find(
    ([key, player]) => player.connectionId === connectionId
  );

  return direction;
};

const orderOfPlay = {
  north: east,
  east: south,
  south: west,
  west: north,
};

const getNextPlayerToPlay = (direction) => orderOfPlay[direction];

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
        ([
          playerKey,
          { connectionId, cards, currentUserAction, ...data } = {},
        ]) => [
          playerKey,
          {
            ...data,
            isUser: connectionId === key,
            currentUserAction: !!currentUserAction,
            cards: connectionId === key ? cards : undefined,
          },
        ]
      );

      const data = {
        players: Object.fromEntries(players),
        gameId: this.gameId,
        state: this.state,
        messageSequence: this.messageSequence,
        currentBid: this.currentBid,
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

  updatePlayerAction(direction) {
    this.players[direction] = {
      ...this.players[direction],
      currentUserAction: true,
    };
  }

  startBidding(direction) {
    this.state = "BIDDING";

    this.players = iterateOverPlayers(
      this.players,
      ([playerDirection, player]) => [
        playerDirection,
        {
          ...player,
          bid: null,
          availableContracts: contracts,
          currentUserAction: playerDirection === direction,
        },
      ]
    );

    this.updateClientState();
  }

  placeBid(bid, direction) {
    const nextDirectionToPlay = getNextPlayerToPlay(direction);

    if (this.state !== "BIDDING") {
      console.error("game not in bidding state");
      return;
    }

    if (!this.players[direction].currentUserAction) {
      console.error("wrong user bid");
      return;
    }

    this.currentBid = bid;

    this.players = iterateOverPlayers(this.players, ([key, player]) => [
      key,
      {
        ...player,
        currentUserAction: key === nextDirectionToPlay,
        availableContracts: getRemainingContracts(this.currentBid),
        bid: key === direction ? bid : player.bid,
      },
    ]);

    this.updateClientState();
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
        return;
      }

      if (action === "BID") {
        const direction = getPlayer(this.players, connectionId);

        // console.log(direction);

        this.placeBid(data.bid, direction);
      }

      if (action === "BEGIN_GAME") {
        this.state = "DEALING";
        this.updateClientState();

        await this.dealCards();

        this.state = "BIDDING";
        this.startBidding("north");
        return;
      }
    });

    this.updateClientState();
  }
}

module.exports = Game;
