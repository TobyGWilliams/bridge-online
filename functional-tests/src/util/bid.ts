import { Page } from "playwright";
import getBidButtonByBid from "./get-bid-button-by-bid";
import { writeLog } from "./logger";

export default async (page: Page, bid: [number, string]) => {
  writeLog(`== bid started - ${bid}`);
  await page.click(getBidButtonByBid(bid));
  writeLog(`== bid successful - ${bid}`);
  return;
};
