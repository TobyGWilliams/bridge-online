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

module.exports = { orderOfSuites, bids, contracts };
