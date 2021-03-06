const { contracts, getRemainingContracts } = require("./bids");

test("the bids are correct", () => {
  expect(contracts).toEqual([
    [1, "CLUB"],
    [1, "DIAMOND"],
    [1, "HEART"],
    [1, "SPADE"],
    [1, "NO_TRUMPS"],
    [2, "CLUB"],
    [2, "DIAMOND"],
    [2, "HEART"],
    [2, "SPADE"],
    [2, "NO_TRUMPS"],
    [3, "CLUB"],
    [3, "DIAMOND"],
    [3, "HEART"],
    [3, "SPADE"],
    [3, "NO_TRUMPS"],
    [4, "CLUB"],
    [4, "DIAMOND"],
    [4, "HEART"],
    [4, "SPADE"],
    [4, "NO_TRUMPS"],
    [5, "CLUB"],
    [5, "DIAMOND"],
    [5, "HEART"],
    [5, "SPADE"],
    [5, "NO_TRUMPS"],
    [6, "CLUB"],
    [6, "DIAMOND"],
    [6, "HEART"],
    [6, "SPADE"],
    [6, "NO_TRUMPS"],
    [7, "CLUB"],
    [7, "DIAMOND"],
    [7, "HEART"],
    [7, "SPADE"],
    [7, "NO_TRUMPS"],
  ]);
});

test("getRemainingBids", () => {
  expect(getRemainingContracts([6, "HEART"])).toEqual([
    [6, "SPADE"],
    [6, "NO_TRUMPS"],
    [7, "CLUB"],
    [7, "DIAMOND"],
    [7, "HEART"],
    [7, "SPADE"],
    [7, "NO_TRUMPS"],
  ]);
});
