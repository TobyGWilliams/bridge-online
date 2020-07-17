const { suites } = require("./cards");

const noTrumps = "NO_TRUMPS";

const orderOfSuites = [
  suites.club,
  suites.diamond,
  suites.heart,
  suites.spade,
  noTrumps,
];

const bids = [1, 2, 3, 4, 5, 6, 7];

const contracts = bids.reduce((accumulator, bid) => {
  return [
    ...accumulator,
    [bid, suites.club],
    [bid, suites.diamond],
    [bid, suites.heart],
    [bid, suites.spade],
    [bid, noTrumps],
  ];
}, []);

const shuffle = (array) => {
  var m = array.length,
    t,
    i;

  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
};

const dealCards = () =>
  shuffle(deck)
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

module.exports = { orderOfSuites, bids, contracts, dealCards };
