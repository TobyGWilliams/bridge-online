"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var get_bid_button_by_bid_1 = __importDefault(require("./get-bid-button-by-bid"));
var logger_1 = __importDefault(require("./logger"));
exports.default = (function (page, bid) {
    logger_1.default("bid: " + bid);
    return page.click(get_bid_button_by_bid_1.default(bid));
});
