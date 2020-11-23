import { v4 as uuid } from "uuid";

import { north, east, south, west, northSouth, eastWest } from "./directions";

interface State {
  dummy?: string;
  declarer?: string;
  currentBid?: Bid;
  winningBid?: Bid;
}

type Bid = [suite: string, level: string];
export type GameCallback = (message: string) => void;

class Game {
  gameId: string;
  callback: GameCallback;
  seed: string;
  players: {};
  state: State;

  static GAME_ACTIONS = {
    newPlayer: "NEW_PLAYER",
    beginGame: "BEGIN_GAME",
    bid: "BID",
  };

  constructor(seed: string, callback: GameCallback) {
    this.callback = callback;
    this.gameId = uuid();
    this.players = {};
    this.seed = seed || uuid();
    this.state = {
      dummy: undefined,
      declarer: undefined,
      currentBid: undefined,
      winningBid: undefined,
    };
  }

  action() {
    this.callback("hello");
  }
}

export default Game;
