import React, { useState } from "react";

import GameContext from "../GameContext";

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

        <code style={{ whiteSpace: "break-spaces" }}>
          {JSON.stringify(state, null, 2)}
        </code>
      </div>
    )}
  </GameContext.Consumer>
);
