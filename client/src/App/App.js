import React, { useState } from "react";

import WelcomePage from "../WelcomePage";
import GameContext from "../GameContext";
import Lobby from "../Lobby";
import Table from "../Table";

import "./index.css";

const App = () => (
  <GameContext.Consumer>
    {({ state, connected, sendMessage }) => {
      return (
        <div className="App">
          <h1>Bridge-Online</h1>
          {connected && !state && <WelcomePage />}
          {connected && state && <Lobby />}
          {connected && state && state?.currentPlayer && <Table />}
        </div>
      );
    }}
  </GameContext.Consumer>
);

export default App;
