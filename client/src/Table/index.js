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
      {state?.currentPlayer?.cards && (
        <div>
          <h2>Your Cards</h2>
          <div>
            {state?.currentPlayer?.cards.map((card) => (
              <Card card={card}></Card>
            ))}
          </div>

        </div>
      )}
      {state?.declarer && (
        <div>
          <h2>Declarer</h2>
          <div>{state.declarer}</div>
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

      <div>
        <h2>Player's Bids</h2>
        <div>
          north: <Bid bid={state?.players?.north?.bid} />
          east:
          <Bid bid={state?.players?.east?.bid} />
          south:
          <Bid bid={state?.players?.south?.bid} />
          west: <Bid bid={state?.players?.west?.bid} />
        </div>
      </div>

      {state?.currentPlayer?.availableContracts && (
        <div>
          <h2>Available Contracts</h2>
          <div>
            <button
              onClick={() => {
                sendMessage("BID", { bid: "PASS" });
              }}
              data-test="place-bid"
              data-test-bid="PASS"
            >
              Pass
            </button>
          </div>
          <div>
            {state?.currentPlayer?.availableContracts.map((bid) => (
              <button
                onClick={() => {
                  sendMessage("BID", { bid });
                }}
                data-test="place-bid"
                data-test-bid={JSON.stringify(bid)}
              >
                <Bid bid={bid} />
              </button>
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
