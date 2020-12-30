import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";

import { useCookies } from "react-cookie";

import App from "./App";

import sendAction from "../util/send-action";
import GameContext from "../GameContext";

import "./index.css";

const SESSION_COOKIE = "session-id";
const port = 7777;

const Wrapper = () => {
  const [gameState, setGameState] = useState(undefined);
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState(undefined);
  const [sessionId, setSessionId] = useState(undefined);
  const [cookie, setCookie] = useCookies();

  useEffect(() => {
    const cookieSessionId = cookie[SESSION_COOKIE];
    const socket = new WebSocket(`ws://localhost:${port}`);

    socket.onopen = () => {
      setConnected(true);
      setSocket(socket);

      // There's no session-id from the cookie, so tell the server this is a new session
      if (!cookieSessionId) {
        sendAction(socket, cookieSessionId, "NEW_SESSION");
        return;
      }

      // Tell the server that we are resuming
      sendAction(socket, cookieSessionId, "RESUME_SESSION");
      setSessionId(cookieSessionId);
    };

    socket.onclose = () => {
      setConnected(false);
      setSocket(undefined);
    };

    socket.onmessage = ({ data: message }) => {
      const { action, data } = JSON.parse(message);

      if (action === "SET_SESSION_ID") {
        if (!data.sessionId) {
          throw new Error("Session Id not set");
        }
        setSessionId(data.sessionId);
        setCookie(SESSION_COOKIE, data.sessionId);

        return;
      }

      if (action === "STATE") {
        // console.log("STATE", data);
        setGameState(data);
      }
    };
  }, []);

  return (
    <GameContext.Provider
      value={{
        state: gameState,
        connected,
        sendMessage: (action, data) =>
          sendAction(socket, sessionId, action, {
            ...data,
            gameId: data?.gameId || gameState?.gameId,
          }),
      }}
    >
      <Helmet>
        <meta
          name="player-cards"
          content={JSON.stringify(gameState?.currentPlayer?.cards)}
        />
        <meta name="game-id" content={gameState?.gameId} />
        <meta name="game-state" content={gameState?.state} />
        <meta name="state" content={JSON.stringify(gameState)} />
      </Helmet>
      <App />
    </GameContext.Provider>
  );
};

export default Wrapper;
