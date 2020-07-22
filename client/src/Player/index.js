import React from "react";

const mapRanks = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  JACK: "J",
  QUEEN: "Q",
  KING: "K",
  ACE: "A",
};

const mapSuites = {
  HEART: <span className="card-icon red-icon">♥</span>,
  SPADE: <span className="card-icon">♠</span>,
  CLUB: <span className="card-icon">♣</span>,
  DIAMOND: <span className="card-icon red-icon">♦</span>,
};

const Card = ({ card: [rank, suite] }) => (
  <span>
    {mapRanks[rank]}
    {mapSuites[suite]}{" "}
  </span>
);

const Bid = ({ bid }) => {
  if (!bid) return null;
  if (bid === "PASS") return "passed";
  return <Card card={bid} />;
};

const Player = ({
  name,
  position,
  data: { state, currentBid, players, ...data } = {},
}) => {
  const playerData = players ? players[position] : undefined;

  return (
    <span className="player-wrapper" style={{ flexBasis: "25%" }}>
      <h2>{name}</h2>
      <div className="game-information">State: {state}</div>
      <div className="game-information">
        Is active player:{" "}
        {playerData && playerData.currentUserAction ? "true" : "false"}
      </div>
      <div className="game-information">
        Current Bid: {currentBid ? <Card card={currentBid} /> : "-"}
      </div>
      <div className="game-information">
        Won the Contract:{" "}
        {playerData && playerData.wonTheContract ? "true" : "false"}
      </div>
      <div className="game-information">
        Bid: {playerData && <Bid bid={playerData.bid} />}
      </div>
      <div className="game-information">
        Cards:{" "}
        {playerData &&
          playerData.cards &&
          playerData.cards.map((card) => <Card card={card} />)}
      </div>
    </span>
  );
};

export default Player;
