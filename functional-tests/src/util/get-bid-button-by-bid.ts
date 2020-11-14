export default (bid: [number, string]) =>
  `button[data-test="place-bid"][data-test-bid="${JSON.stringify(bid).replace(
    /\"/g,
    '\\"'
  )}"]`;
