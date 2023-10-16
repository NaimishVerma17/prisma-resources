"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundException = void 0;
const root_1 = require("./root");
class NotFoundException extends root_1.HttpException {
    constructor(message, errorCode) {
        super(message, errorCode, 404, null);
    }
}
exports.NotFoundException = NotFoundException;
