import React, { useState, useContext } from "react";

import GameContext from "../GameContext";

export default () => {
  const { state, connected, sendMessage } = useContext(GameContext);
  const [position, setPosition] = useState("north");
  const [name, setName] = useState(undefined);

  return (
    <div>
      <h2>Welcome to your game</h2>
      <h3>Game ID: {state.gameId}</h3>
      {!state.currentPlayer && (
        <div>
          <input
            data-test="player-name-input"
            onChange={(event) => {
              setName(event.target.value);
            }}
          ></input>
          <select
            data-test="player-direction"
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
            data-test="new-player-submit"
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
  );
};
