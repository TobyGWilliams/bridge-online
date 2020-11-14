"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (bid) {
    return "button[data-test=\"place-bid\"][data-test-bid=\"" + JSON.stringify(bid).replace(/\"/g, '\\"') + "\"]";
});
