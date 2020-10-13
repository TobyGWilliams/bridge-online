import React, { useContext } from "react";

import GameContext from "../GameContext";
import Card from "../components/Card";
import Bid from "../components/Bid";
import Player from "../components/Player";

const allPlayersReady = (players) =>
  players.north && players.east && players.south && players.west;

export default () => {
  const { state, connected, sendMessage } = useContext(GameContext);

  return (
    <div>
      <h1>Table</h1>
      <Player direction="north" player={state?.players?.north}></Player>
      <Player direction="east" player={state?.players?.east}></Player>
      <Player direction="south" player={state?.players?.south}></Player>
      <Player direction="west" player={state?.players?.west}></Player>
      {state?.currentPlayer && (
        <div>
          <h2>Your Move?</h2>
          <div>
            {state?.currentPlayer?.currentUserAction
              ? "Your move"
              : "Waiting for other players"}
          </div>
        </div>
      )}
      {state?.currentBid && (
        <div>
          <h2>Current Bid</h2>
          <div>
            <Bid bid={state?.currentBid} />
          </div>
        </div>
      )}
      {state?.currentPlayer?.availableContracts && (
        <div>
          <h2>Available Contracts</h2>
          <div>
            {state?.currentPlayer?.availableContracts.map((bid) => (
              <Bid bid={bid} sendMessage={sendMessage} />
            ))}
          </div>
        </div>
      )}
      {allPlayersReady(state?.players) && state?.state === "LOBBY" && (
        <button
          data-test="begin-game-button"
          onClick={() => {
            sendMessage("BEGIN_GAME");
          }}
        >
          start the game
        </button>
      )}
    </div>
  );
};
