import React, { useState, useEffect } from "react";

import Player from "../Player";

import playTheGame from "./client";

import "./index.css";

const App = () => {
  const [player1State, setPlayer1State] = useState(undefined);
  const [player2State, setPlayer2State] = useState(undefined);
  const [player3State, setPlayer3State] = useState(undefined);
  const [player4State, setPlayer4State] = useState(undefined);

  useEffect(() => {
    playTheGame(
      setPlayer1State,
      setPlayer2State,
      setPlayer3State,
      setPlayer4State
    );
  }, []);

  return (
    <div className="App">
      <h1>Bridge-Online</h1>
      <div style={{ display: "flex" }}>
        <Player name="Toby" data={player1State} position="north" />
        <Player name="Jessica" data={player2State} position="east" />
        <Player name="Jamie" data={player3State} position="south" />
        <Player name="David" data={player4State} position="west" />
      </div>
    </div>
  );
};

export default App;
