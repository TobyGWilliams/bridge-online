import { v4 as uuid } from "uuid";
import logger from "../utils/logger";

import { north, east, south, west, northSouth, eastWest } from "./directions";

interface Player {
  userId: string;
}
interface State {
  stateName: string;
  dummy?: string;
  declarer?: string;
  currentBid?: Bid;
  winningBid?: Bid;
  initialDirection: string;
  players: {
    north?: Player;
    south?: Player;
    east?: Player;
    west?: Player;
  };
}

type Bid = [suite: string, level: string];
export type GameCallback = (message: any, playerId: string) => void;

class Game {
  gameId: string;
  callback: GameCallback;
  seed: string;
  users: Array<string>;
  state: State;

  static GAME_ACTIONS = {
    newPlayer: "NEW_PLAYER",
    beginGame: "BEGIN_GAME",
    bid: "BID",
  };

  constructor(gameId: string, seed: string, callback: GameCallback) {
    this.callback = callback;
    this.gameId = gameId;
    this.users = [];
    this.seed = seed || uuid();
    this.state = {
      stateName: "LOBBY",
      dummy: undefined,
      declarer: undefined,
      currentBid: undefined,
      winningBid: undefined,
      initialDirection: north,
      players: {
        north: undefined,
        south: undefined,
        east: undefined,
        west: undefined,
      },
    };
  }

  updateClientsState() {
    this.users.forEach((user) => {
      this.callback({ gameId: this.gameId }, user);
    });
  }

  addUser(userId: string) {
    this.users.push(userId);
    this.updateClientsState();
  }

  gameAction(userId: string, action: string, data: object) {
    logger("in game action");
    logger({ action, data, userId });

    if (action === Game.GAME_ACTIONS.newPlayer) {

      this.state
    }
  }
}

export default Game;
