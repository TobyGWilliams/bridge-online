import React, { useState } from "react";

import GameContext from "../GameContext";

export default () => {
  const [position, setPosition] = useState("north");
  const [name, setName] = useState(undefined);

  return (
    <GameContext.Consumer>
      {({ state, sendMessage }) => (
        <div>
          <h2>Welcome to your game</h2>
          <h3>Game ID: {state.gameId}</h3>
          {!state.currentPlayer && (
            <div>
              <input
                onChange={(event) => {
                  setName(event.target.value);
                }}
              ></input>
              <select
                name="position"
                onChange={(event) => {
                  setPosition(event.target.value);
                }}
              >
                <option value="north">North</option>
                <option value="east">East</option>
                <option value="south">South</option>
                <option value="west">West</option>
              </select>

              <button
                onClick={() => {
                  sendMessage("NEW_PLAYER", {
                    name,
                    position,
                  });
                }}
              >
                Seat
              </button>
            </div>
          )}
        </div>
      )}
    </GameContext.Consumer>
  );
};
