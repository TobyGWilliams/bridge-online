import { v4 as uuid } from "uuid";

import { Action, Game, GameActionTypes, Games } from "./types";

function reducer(games: Games = {}, { type, data, sessionId }: Action): Games {
  if (type === GameActionTypes.createGame) {
    const usersAssociatedWithGames = Object.values(games).flatMap(
      (game) => game.users
    );

    if (usersAssociatedWithGames.includes(sessionId)) {
      return games;
    }

    const { seed } = data;
    const gameId = uuid();

    const game: Game = {
      seed: seed || uuid(),
      stateName: "LOBBY",
      initialDirection: "north",
      players: {},
      users: [sessionId],
    };

    return { ...games, [gameId]: game };
  }

  return games;
}

export default reducer;
