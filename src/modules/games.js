let games = {};

const getGames = () => {
  return { ...games };
};

const setGame = (id, game) => {
  games = { ...games, [id]: game };
};

setInterval(() => console.info(games), 1000);

module.exports = {
  getGames,
  setGame,
};
