const { dealCards } = require("./cards");

test("with same seed", () => {
  const cards1 = dealCards("helloworld");
  const cards2 = dealCards("helloworld");

  expect(cards1).toEqual(cards2);
});

test("with different seed", () => {
  const cards1 = dealCards("1abc");
  const cards2 = dealCards("2abc");

  expect(cards1).not.toEqual(cards2);
});

test("deal cards 1", () => {
  const cards = dealCards();
  expect(cards.length).toEqual(4);

  expect(cards[0].length).toEqual(13);
  expect(cards[1].length).toEqual(13);
  expect(cards[2].length).toEqual(13);
  expect(cards[3].length).toEqual(13);
});

test("deal cards 2", () => {
  const cards = dealCards();
  expect(cards.length).toEqual(4);

  expect(cards[0].length).toEqual(13);
  expect(cards[1].length).toEqual(13);
  expect(cards[2].length).toEqual(13);
  expect(cards[3].length).toEqual(13);
});

test("deal cards 3", () => {
  const cards = dealCards();
  expect(cards.length).toEqual(4);

  expect(cards[0].length).toEqual(13);
  expect(cards[1].length).toEqual(13);
  expect(cards[2].length).toEqual(13);
  expect(cards[3].length).toEqual(13);
});

test("deal cards 4", () => {
  const cards = dealCards();
  expect(cards.length).toEqual(4);

  expect(cards[0].length).toEqual(13);
  expect(cards[1].length).toEqual(13);
  expect(cards[2].length).toEqual(13);
  expect(cards[3].length).toEqual(13);
});

test("deal cards 5", () => {
  const cards = dealCards();
  expect(cards.length).toEqual(4);

  expect(cards[0].length).toEqual(13);
  expect(cards[1].length).toEqual(13);
  expect(cards[2].length).toEqual(13);
  expect(cards[3].length).toEqual(13);
});

test("deal cards 6", () => {
  const cards = dealCards();
  expect(cards.length).toEqual(4);

  expect(cards[0].length).toEqual(13);
  expect(cards[1].length).toEqual(13);
  expect(cards[2].length).toEqual(13);
  expect(cards[3].length).toEqual(13);
});

test("deal cards 7", () => {
  const cards = dealCards();
  expect(cards.length).toEqual(4);

  expect(cards[0].length).toEqual(13);
  expect(cards[1].length).toEqual(13);
  expect(cards[2].length).toEqual(13);
  expect(cards[3].length).toEqual(13);
});

test("deal cards 8", () => {
  const cards = dealCards();
  expect(cards.length).toEqual(4);

  expect(cards[0].length).toEqual(13);
  expect(cards[1].length).toEqual(13);
  expect(cards[2].length).toEqual(13);
  expect(cards[3].length).toEqual(13);
});
