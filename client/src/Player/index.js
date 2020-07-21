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
      <div>State: {state}</div>
      <div>Current Bid: {currentBid ? <Card card={currentBid} /> : "-"}</div>
      <div>Bid: {playerData && <Bid bid={playerData.bid} />}</div>
      {playerData && playerData.cards && (
        <div>
          Cards:{" "}
          {playerData.cards.map((card) => (
            <Card card={card} />
          ))}
        </div>
      )}
    </span>
  );
};

{
  /* {playerData && <pre>{JSON.stringify(playerData.cards, null, 2)}</pre>} */
}

export default Player;
