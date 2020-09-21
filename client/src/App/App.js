import React, { useState } from "react";

import WelcomePage from "../WelcomePage";
import GameContext from "../GameContext";

import "./index.css";

const App = () => (
  <GameContext.Consumer>
    {({ state, connected, sendMessage }) => {
      return (
        <div className="App">
          <h1>Bridge-Online</h1>
          {connected && !state && <WelcomePage />}
          {connected && state && (
            <div>
              <h2>Welcome to your game</h2>
              <h3>Game ID: {state.gameId}</h3>
              {!state.currentPlayer && (
                <div>
                  <input></input>
                  <button
                    onClick={() => {
                      sendMessage("NEW_PLAYER", {
                        name: "cheese",
                        position: "north",
                      });
                    }}
                  >
                    Seat
                  </button>
                </div>
              )}
              {state.currentPlayer && <div>Welcome cheese face!</div>}
            </div>
          )}
        </div>
      );
    }}
  </GameContext.Consumer>
);

export default App;
