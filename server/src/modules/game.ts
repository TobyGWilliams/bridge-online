import { v4 as uuid } from "uuid";

import { north, east, south, west, northSouth, eastWest } from "./directions";

interface State {
  stateName: string;
  dummy?: string;
  declarer?: string;
  currentBid?: Bid;
  winningBid?: Bid;
}

type Bid = [suite: string, level: string];
export type GameCallback = (message: any, playerId: string) => void;

class Game {
  gameId: string;
  callback: GameCallback;
  seed: string;
  players: Array<string>;
  state: State;

  static GAME_ACTIONS = {
    newPlayer: "NEW_PLAYER",
    beginGame: "BEGIN_GAME",
    bid: "BID",
  };

  constructor(gameId: string, seed: string, callback: GameCallback) {
    this.callback = callback;
    this.gameId = gameId;
    this.players = [];
    this.seed = seed || uuid();
    this.state = {
      stateName: "LOBBY",
      dummy: undefined,
      declarer: undefined,
      currentBid: undefined,
      winningBid: undefined,
    };
  }

  updateClientsState() {
    this.players.forEach((player) => {
      this.callback({ gameId: this.gameId }, player);
    });
  }

  addPlayer(playerId: string) {
    this.players.push(playerId);
    this.updateClientsState();
  }
}

export default Game;
