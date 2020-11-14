"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messageCount = 0;
exports.default = (function (message) {
    messageCount += 1;
    console.log("\t" + (messageCount < 10 ? " " : "") + messageCount + ". " + message);
});
