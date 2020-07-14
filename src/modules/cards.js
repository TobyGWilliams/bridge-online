const { deck } = require("../constants/cards");

function shuffle(array) {
  var m = array.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

const dealCards = () =>
  shuffle(deck)
    .reduce(
      ([hand1, hand2, hand3, hand4], card, currentIndex) => {
        const random = Math.floor(currentIndex % 4)

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

module.exports = { dealCards };
