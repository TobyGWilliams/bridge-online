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
  constructor() {
    this.gameId = uuid();
    this.callbacks = {};
    this.players = {};
    this.state = "LOBBY";
    this.messageSequence = 1;
    this.currentBid = null;
  }

  static GAME_ACTIONS = {
    newPlayer: "NEW_PLAYER",
    beginGame: "BEGIN_GAME",
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
        messageSequence: this.messageSequence,
        currentBid: this.currentBid,
      };

      this.messageSequence += 1;

      callback(JSON.stringify({ action: "STATE", data }));
    });
  }

  dealCards() {
    const [hand1, hand2, hand3, hand4] = dealCards();

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
  }
}

module.exports = Game;

// if (action === "BID") {
//   const direction = getPlayer(this.players, connectionId);

//   console.log(direction);

//   this.placeBid(data.bid, direction);
// }  // placeBid(bid, direction) {
//   const nextDirectionToPlay = getNextPlayerToPlay(direction);

//   if (this.state !== "BIDDING") {
//     console.error("game not in bidding state");
//     return;
//   }

//   if (!this.players[direction].currentUserAction) {
//     console.error("wrong user bid");
//     return;
//   }

//   if (bid !== "PASS") {
//     this.currentBid = bid;
//   }

//   if (bid === "PASS") {
//     const previous = reverseOrderOfPlay[direction];
//     const previous1 = reverseOrderOfPlay[previous];

//     // check if all the players have passed
//     if (
//       this.players[previous].bid === "PASS" &&
//       this.players[previous1].bid === "PASS"
//     ) {
//       this.state = "LEADING_FIRST_CARD";

//       this.players = iterateOverPlayers(this.players, ([key, player]) => [
//         key,
//         {
//           ...player,
//           currentUserAction: key === orderOfPlay[direction],
//           availableContracts: getRemainingContracts(this.currentBid),
//           wonTheContract: key === direction,
//           bid: key === direction ? bid : player.bid,
//         },
//       ]);

//       this.updateClientState();

//       return;
//     }
//   }

//   this.players = iterateOverPlayers(this.players, ([key, player]) => [
//     key,
//     {
//       ...player,
//       currentUserAction: key === nextDirectionToPlay,
//       availableContracts: getRemainingContracts(this.currentBid),
//       bid: key === direction ? bid : player.bid,
//     },
//   ]);

//   this.updateClientState();
// }
// updatePlayerAction(direction) {
//   this.players[direction] = {
//     ...this.players[direction],
//     currentUserAction: true,
//   };
// }
