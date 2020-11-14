import React, { useContext } from "react";

import WelcomePage from "../WelcomePage";
import GameContext from "../GameContext";
import Lobby from "../Lobby";
import Table from "../Table";

import "./index.css";

const App = () => {
  const { state, connected, sendMessage } = useContext(GameContext);
  return (
    <div className="App">
      <h1>Bridge-Online</h1>
      {connected && <h3>Game State: {state?.state}</h3>}
      {connected && !state && <WelcomePage />}
      {connected && state && <Lobby />}
      {connected && state && state?.currentPlayer && <Table />}
    </div>
  );
};

export default App;
