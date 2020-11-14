const { v4: uuid } = require("uuid");

const { contracts, getRemainingContracts } = require("./bids");
const { dealCards } = require("./cards");
const { north, east, south, west } = require("./directions");

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

const reverseOrderOfPlay = {
  north: west,
  east: north,
  south: east,
  west: south,
};

const orderOfPlay = {
  north: east,
  east: south,
  south: west,
  west: north,
};

const getNextPlayerToPlay = (direction) => orderOfPlay[direction];

class Game {
  constructor(seed) {
    this.seed = seed;
    this.gameId = uuid();
    this.callbacks = {};
    this.players = {};
    this.state = "LOBBY";
    this.messageSequence = 1;
    this.currentBid = null;
    this.winningBid = null;
    this.bids = [];
  }

  static GAME_ACTIONS = {
    newPlayer: "NEW_PLAYER",
    beginGame: "BEGIN_GAME",
    bid: "BID",
  };

  getState() {
    return { ...this };
  }

  updateClientState() {
    sendToAll(this.callbacks, ([key, callback]) => {
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

      const [playerDirection = undefined, currentPlayer = undefined] =
        Object.entries(this.players).find(
          ([direction, playerState]) => playerState.connectionId === key
        ) || [];

      const data = {
        currentPlayer: playerDirection
          ? {
              ...currentPlayer,
              direction: playerDirection,
            }
          : undefined,
        players: Object.fromEntries(players),
        gameId: this.gameId,
        state: this.state,
        seed: this.seed,
        messageSequence: this.messageSequence,
        currentBid: this.currentBid,
        contracts,
      };

      this.messageSequence += 1;

      callback(JSON.stringify({ action: "STATE", data }));
    });
  }

  dealCards() {
    const [hand1, hand2, hand3, hand4] = dealCards(this.seed);

    this.players = {
      north: { ...this.players.north, cards: hand1 },
      south: { ...this.players.south, cards: hand2 },
      east: { ...this.players.east, cards: hand3 },
      west: { ...this.players.west, cards: hand4 },
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
    console.log(bid, direction);
    const nextDirectionToPlay = getNextPlayerToPlay(direction);

    if (this.state !== "BIDDING") {
      return;
    }

    if (!this.players[direction].currentUserAction) {
      return;
    }

    if (bid === "PASS") {
      const previous = reverseOrderOfPlay[direction];
      const previous1 = reverseOrderOfPlay[previous];

      // check if all the players have passed
      if (
        this.players[previous].bid === "PASS" &&
        this.players[previous1].bid === "PASS"
      ) {
        const [lastDirectionToBid, lastBid] = this.bids[0];

        this.state = "LEADING_FIRST_CARD";
        this.winningBid = lastBid;
        this.players = iterateOverPlayers(this.players, ([key, player]) => [
          key,
          {
            ...player,
            currentUserAction: key === orderOfPlay[direction],
            availableContracts: getRemainingContracts(this.currentBid),
            wonTheContract: key === lastDirectionToBid,
            bid: key === direction ? bid : player.bid,
          },
        ]);

        this.updateClientState();

        return;
      }

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

    this.bids = [[direction, bid], ...this.bids];
    this.currentBid = bid;

    console.log(182, this.currentBid, this.bids);

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

  updatePlayerAction(direction) {
    this.players[direction] = {
      ...this.players[direction],
      currentUserAction: true,
    };
  }

  addConnection(connectionId, callback) {
    this.callbacks[connectionId] = callback;

    this.updateClientState();
  }

  action(connectionId, action, data) {
    if (action === Game.GAME_ACTIONS.newPlayer) {
      if (!data.position) return;
      if (this.players[data.position]) return;

      this.players = {
        ...this.players,
        [data.position]: { name: data.name, connectionId },
      };

      this.updateClientState();
      return;
    }

    if (action === Game.GAME_ACTIONS.beginGame) {
      this.state = "DEALING";

      this.dealCards();

      this.state = "BIDDING";
      this.startBidding("north");

      this.updateClientState();
      return;
    }

    if (action === Game.GAME_ACTIONS.bid) {
      const direction = getPlayer(this.players, connectionId);

      this.placeBid(data.bid, direction);
    }
  }
}

module.exports = Game;
