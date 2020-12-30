export enum GameActionTypes {
  createGame = "CREATE_GAME",
}

export type Bid = [suite: string, level: string];

export interface Player {
  userId: string;
}

export interface Game {
  currentBid?: Bid;
  declarer?: string;
  dummy?: string;
  initialDirection: string;
  players: {
    north?: Player;
    south?: Player;
    east?: Player;
    west?: Player;
  };
  seed: string;
  stateName: string;
  users: string[];
  winningBid?: Bid;
}

export interface Games {
  [key: string]: Game;
}

export interface Action {
  data: {
    seed?: string;
  };
  sessionId: string;
  type: GameActionTypes;
}
