import React from "react";

const cards = {
  HEART: "♥",
  SPADE: "♠",
  CLUB: "♣",
  DIAMOND: "♦",
  NO_TRUMPS: "NT",
};

export default ({ bid, sendMessage = () => {} }) => {
  const [number, suite] = bid;

  return (
    <button
      onClick={() => {
        sendMessage("BID", { bid });
      }}
    >
      <span className="card">
        {number}
        {cards[suite]}
      </span>
    </button>
  );
};
