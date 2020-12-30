import { v4 as uuid } from "uuid";

import { Action, GameActionTypes, Games, Game } from "./types";

function reducer(state: Games = {}, { type, data }: Action): Games {
  if (type === GameActionTypes.createGame) {
    const { seed } = data;

    const gameId = uuid();
    const game: Game = {
      seed: seed || uuid(),
      stateName: "LOBBY",
      initialDirection: "north",
      players: {},
    };

    return { ...state, [gameId]: game };
  }

  return state;
}

export default reducer;
