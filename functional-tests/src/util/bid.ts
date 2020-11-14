import { Page } from "playwright";
import getBidButtonByBid from "./get-bid-button-by-bid";

export default (page: Page, bid: [number, string]) =>
  page.click(getBidButtonByBid(bid));
