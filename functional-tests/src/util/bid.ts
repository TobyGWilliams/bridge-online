import { Page } from "playwright";
import getBidButtonByBid from "./get-bid-button-by-bid";
import { log } from "../logger";

const bid = async (page: Page, bid: [number, string]) =>
  page.click(getBidButtonByBid(bid));

export default (...props: any) =>
  // @ts-ignore
  log(() => bid(...props), "bid");
