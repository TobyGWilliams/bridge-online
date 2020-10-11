import React, { useState } from "react";

import GameContext from "../GameContext";

const allPlayersReady = (players) =>
  players.north && players.east && players.south && players.west;

const Player = ({ player, direction }) => {
  return (
    <div>
      {direction}: {player ? player.name : "Waiting for player to join"}
    </div>
  );
};

export default () => (
  <GameContext.Consumer>
    {({ state, connected, sendMessage }) => (
      <div>
        <h1>Table</h1>
        <Player direction="north" player={state?.players?.north}></Player>
        <Player direction="east" player={state?.players?.east}></Player>
        <Player direction="south" player={state?.players?.south}></Player>
        <Player direction="west" player={state?.players?.west}></Player>
        {state?.currentPlayer?.cards && (
          <div>
            <h2>Your Cards</h2>
            <div>cards</div>
          </div>
        )}
        {allPlayersReady(state?.players) && (
          <button
            data-test="begin-game-button"
            onClick={() => {
              sendMessage("BEGIN_GAME");
            }}
          >
            start the game
          </button>
        )}
        <div>
          <code style={{ whiteSpace: "break-spaces" }}>
            {JSON.stringify(state.currentPlayer, null, 2)}
          </code>
        </div>
      </div>
    )}
  </GameContext.Consumer>
);
