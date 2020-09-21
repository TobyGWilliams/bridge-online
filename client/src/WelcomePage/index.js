import React, { useState } from "react";

import GameContext from "../GameContext";

const ComponentName = () => {
  const [gameIdInput, setgameIdInput] = useState(undefined);
  return (
    <GameContext.Consumer>
      {({ state, connected, sendMessage }) => (
        <div>
          <button
            onClick={() => {
              sendMessage("CREATE_GAME");
            }}
          >
            Create Game
          </button>
          <div>
            <input
              onChange={(event) => {
                setgameIdInput(event.target.value);
              }}
            ></input>
          </div>
          <div>
            <button
              onClick={() => {
                console.log(gameIdInput);
                sendMessage("JOIN_GAME", { gameId: gameIdInput });
              }}
            >
              Join Game
            </button>
          </div>
        </div>
      )}
    </GameContext.Consumer>
  );
};

export default ComponentName;
