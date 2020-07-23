import React from "react";

import GameContext from "../GameContext";

import "./index.css";

const App = () => (
  <GameContext.Consumer>
    {({ state, connected, sendMessage }) => {
      console.log(state, connected);
      return (
        <div className="App">
          <h1>Bridge-Online</h1>
          <button
            onClick={() => {
              sendMessage("CREATE_GAME");
            }}
          >
            Create Game
          </button>
        </div>
      );
    }}
  </GameContext.Consumer>
);

export default App;
