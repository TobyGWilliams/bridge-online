import React, { useState, useContext } from "react";

import GameContext from "../GameContext";

export default () => {
  const [gameIdInput, setgameIdInput] = useState(undefined);
  const { state, connected, sendMessage } = useContext(GameContext);
  return (
    <div>
      <button
        data-test="create-game"
        onClick={() => {
          sendMessage("CREATE_GAME");
        }}
      >
        Create Game
      </button>
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
