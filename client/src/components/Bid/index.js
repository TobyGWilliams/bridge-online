import React from "react";

const cards = {
  HEART: "♥",
  SPADE: "♠",
  CLUB: "♣",
  DIAMOND: "♦",
  NO_TRUMPS: "NT",
};

export default ({ bid }) => {
  if (!bid) {
    return " -";
  }

  if (bid === "PASS") {
    return " PASS";
  }

  const [number, suite] = bid;

  return (
    <span className="card">
      {number}
      {cards[suite]}
    </span>
  );
};
