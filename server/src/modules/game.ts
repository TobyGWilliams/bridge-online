import { v4 as uuid } from "uuid";

import { contracts, getRemainingContracts } from "./bids";
import { dealCards } from "./cards";
import { north, east, south, west, northSouth, eastWest } from "./directions";

const sendToAll = (
  connections: { [s: string]: unknown } | ArrayLike<unknown>,
  callback: {
    ([key, callback]: [any, any]): void;
    (value: [string, unknown], index: number, array: [string, unknown][]): void;
  }
) => {
  Object.entries(connections).forEach(callback);
};

const iterateOverPlayers = (
  players: { [s: string]: unknown } | ArrayLike<unknown>,
  callback: {
    ([playerDirection, player]: [any, any]): any[];
    ([key, player]: [any, any]): any[];
    ([key, player]: [any, any]): any[];
    ([key, player]: [any, any]): any[];
    (
      value: [string, unknown],
      index: number,
      array: [string, unknown][]
    ): unknown;
  }
) => {
  const playersAsArray = Object.entries(players).map(callback);
  return Object.fromEntries(playersAsArray);
};

const getPlayer = (
  players: { [s: string]: unknown } | ArrayLike<unknown>,
  connectionId: any
) => {
  const [direction] = Object.entries(players).find(
    ([key, player]) => player.connectionId === connectionId
  );

  return direction;
};

const partners = {
  north: northSouth,
  east: eastWest,
  south: northSouth,
  west: eastWest,
};

const oppositePartner = {
  north: south,
  east: west,
  south: north,
  west: east,
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

const getNextPlayerToPlay = (direction: string | number) =>
  orderOfPlay[direction];

interface Callbacks {
  [key: string]: () => void;
}

type Bid = [suite: string, level: string];

class Game {
  gameId: string;
  callbacks: Callbacks;
  seed: string;
  dummy: null;
  declarer: null;
  players: {};
  state: string;
  messageSequence: number;
  currentBid?: Bid;
  winningBid?: Bid;
  bids: Bid[];

  constructor(seed: string) {
    this.declarer = null;
    this.dummy = null;
    this.seed = seed;
    this.gameId = uuid();
    this.callbacks = {};
    this.players = {};
    this.state = "LOBBY";
    this.messageSequence = 1;
    this.currentBid = undefined;
    this.winningBid = undefined;
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
            numberOfCardsHeld: cards && cards.length,
          },
        ]
      );

      const [playerDirection = undefined, currentPlayer = undefined] =
        Object.entries(this.players).find(
          ([direction, playerState]) => playerState.connectionId === key
        ) || [];

      const data = {
        contracts,
        currentBid: this.currentBid,
        currentPlayer: playerDirection
          ? { ...currentPlayer, direction: playerDirection }
          : undefined,
        declarer: this.declarer,
        dummy: this.dummy,
        gameId: this.gameId,
        messageSequence: this.messageSequence,
        players: Object.fromEntries(players),
        seed: this.seed,
        state: this.state,
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

  startBidding(direction: string) {
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

  placeBid(bid: string | null, direction: unknown) {
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
        const [winningContract, winningSuit] = lastBid;

        const winningPartners = partners[lastDirectionToBid];

        const winningBids = this.bids.filter(
          ([direction, [contract, suit]]) =>
            partners[direction] === winningPartners && suit === winningSuit
        );

        const [declarer] = winningBids[winningBids.length - 1];

        this.state = "LEADING_FIRST_CARD";
        this.winningBid = lastBid;
        this.declarer = declarer;
        this.dummy = oppositePartner[this.declarer];

        this.players = iterateOverPlayers(this.players, ([key, player]) => [
          key,
          {
            ...player,
            currentUserAction: key === orderOfPlay[this.declarer],
            availableContracts: getRemainingContracts(this.currentBid),
            bid: key === direction ? bid : player.bid,
            declarer: key === this.declarer,
            dummy: key === this.dummy,
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
      return;
    }

    this.bids = [[direction, bid], ...this.bids];
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

  updatePlayerAction(direction: string | number) {
    this.players[direction] = {
      ...this.players[direction],
      currentUserAction: true,
    };
  }

  addConnection(
    connectionId: string,
    callback: { (message: any): void; (message: any): void }
  ) {
    this.callbacks[connectionId] = callback;

    this.updateClientState();
  }

  action(
    connectionId: string,
    action: string,
    data: { position: string | number; name: any; bid: any }
  ) {
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

export default Game;
