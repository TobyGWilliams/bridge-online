import { Page } from "playwright";
import getBidButtonByBid from "./get-bid-button-by-bid";
import logger from "./logger";

export default (page: Page, bid: [number, string]) => {
  logger(`bid: ${bid}`);
  return page.click(getBidButtonByBid(bid));
};
