import React, { useState, useEffect } from "react";

import App from "./App";

import sendAction from "../util/send-action";
import GameContext from "../GameContext";

import "./index.css";

const port = 7777;

const Wrapper = () => {
  const [gameState, setGameState] = useState(undefined);
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState(undefined);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:${port}`);

    socket.onopen = () => {
      setConnected(true);
      setSocket(socket);
      sendAction(socket, "NEW_SESSION");
    };

    socket.onclose = () => {
      setConnected(false);
      setSocket(undefined);
    };

    socket.onmessage = ({ data: message }) => {
      const { action, data } = JSON.parse(message);

      if (action === "SET_CONNECTION_ID") {
        console.log("connectionId", data);
      }

      if (action === "STATE") {
        setGameState(data);
      }
    };
  }, []);

  return (
    <GameContext.Provider
      value={{
        state: gameState,
        connected,
        sendMessage: (action, data) => sendAction(socket, action, data),
      }}
    >
      <App />
    </GameContext.Provider>
  );
};

export default Wrapper;
