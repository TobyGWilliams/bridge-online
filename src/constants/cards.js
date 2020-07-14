const suites = {
  heart: "HEART",
  spade: "SPADE",
  club: "CLUB",
  diamond: "DIAMOND",
};

const cards = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "JACK",
  "QUEEN",
  "KING",
  "ACE",
];

const deck = cards.reduce((accumulator, card) => {
  return [
    ...accumulator,
    [card, suites.heart],
    [card, suites.spade],
    [card, suites.club],
    [card, suites.diamond],
  ];
}, []);
  

module.exports = {
  deck,
  cards,
  suites,
};
