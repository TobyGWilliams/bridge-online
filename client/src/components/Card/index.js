import React from "react";

const cards = { HEART: "♥", SPADE: "♠", CLUB: "♣", DIAMOND: "♦" };

const faceCards = {
  ACE: "A",
  KING: "K",
  QUEEN: "Q",
  JACK: "J",
};

export default ({ card }) => {
  const [number, suite] = card;

  return (
    <span className="card">
      {faceCards[number] || number}
      {cards[suite]}
    </span>
  );
};
