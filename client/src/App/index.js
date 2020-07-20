import React, { useState, useEffect } from "react";

import Player from "../Player";

import playTheGame from "./client";

import "./index.css";

const App = () => {
  const [player1State, setPlayer1State] = useState(null);
  const [player2State, setPlayer2State] = useState(null);
  const [player3State, setPlayer3State] = useState(null);
  const [player4State, setPlayer4State] = useState(null);

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
        <Player name="Player1" data={player1State} />
        <Player name="Player2" data={player2State} />
        <Player name="Player3" data={player3State} />
        <Player name="Player4" data={player4State} />
      </div>
    </div>
  );
};

export default App;
