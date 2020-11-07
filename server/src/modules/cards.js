const seedrandom = require("seedrandom");

const shuffle = (array, seed) => {
  console.log(seed);
  const random = seedrandom(seed);

  let m = array.length,
    t,
    i;

  while (m) {
    i = Math.floor(random() * m--);
    t = array[m];

    array[m] = array[i];
    array[i] = t;
  }

  return array;
};

const dealCards = (seed) =>
  shuffle([...deck], seed)
    .reduce(
      ([hand1, hand2, hand3, hand4], card, currentIndex) => {
        const random = Math.floor(currentIndex % 4);

        return [
          [...hand1, random === 0 ? card : undefined],
          [...hand2, random === 1 ? card : undefined],
          [...hand3, random === 2 ? card : undefined],
          [...hand4, random === 3 ? card : undefined],
        ];
      },
      [[], [], [], []]
    )
    .map((hand) => hand.filter((card) => card));

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

module.exports = { dealCards, suites, cards, deck };
