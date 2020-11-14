import { Page } from "playwright";

import getCards from "./get-cards";

export default async (page: Page, PLAYERCARDS: string) => {
  const playerCards = await getCards(page);

  if (playerCards !== PLAYERCARDS) {
    throw new Error("player cards incorrect!");
  }
};
