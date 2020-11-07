import React from "react";

const cards = {
  HEART: "♥",
  SPADE: "♠",
  CLUB: "♣",
  DIAMOND: "♦",
  NO_TRUMPS: "NT",
};

export default ({ bid }) => {
  const [number, suite] = bid;

  return (
    <span className="card">
      {number}
      {cards[suite]}
    </span>
  );
};
