Feature("Game 1 Bid Up No Trumps");

Scenario("test something", async ({ I }) => {
  I.amOnPage("/");

  I.fillField('input[data-test="input-seed"]', "this is the game seed");
  I.click('button[data-test="create-game"]');

  I.waitForElement('head > meta[name="game-id"]');

  const gameId = await I.executeScript(() =>
    document
      .querySelector('head > meta[name="game-id"]')
      .getAttribute("content")
  );

  pause();

  I.openNewTab();
  I.amOnPage("/");
  I.fillField('input[data-test="input-game-id"]', gameId);
  I.click('button[data-test="join-game"]');

  I.openNewTab();
  I.amOnPage("/");
  I.fillField('input[data-test="input-game-id"]', gameId);
  I.click('button[data-test="join-game"]');

  I.openNewTab();
  I.amOnPage("/");
  I.fillField('input[data-test="input-game-id"]', gameId);
  I.click('button[data-test="join-game"]');

  I.switchToPreviousTab(2);
});
