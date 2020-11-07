import React, { useState, useContext } from "react";

import GameContext from "../GameContext";

export default () => {
  const [gameIdInput, setgameIdInput] = useState(undefined);
  const [seed, setSeed] = useState(undefined);
  const { state, connected, sendMessage } = useContext(GameContext);

  return (
    <div>
      <h2>Create Game</h2>
      <div>
        <input
          data-test="input-seed"
          onChange={(event) => {
            setSeed(event.target.value);
          }}
        ></input>
      </div>
      <button
        data-test="create-game"
        onClick={() => {
          sendMessage("CREATE_GAME", { seed });
        }}
      >
        Create Game
      </button>
      <h2>Join Game</h2>
      <div>
        <input
          data-test="input-game-id"
          onChange={(event) => {
            setgameIdInput(event.target.value);
          }}
        ></input>
      </div>
      <div>
        <button
          data-test="join-game"
          onClick={() => {
            sendMessage("JOIN_GAME", { gameId: gameIdInput });
          }}
        >
          Join Game
        </button>
      </div>
    </div>
  );
};
