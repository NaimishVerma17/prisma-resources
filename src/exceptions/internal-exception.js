"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalException = void 0;
const root_1 = require("./root");
class InternalException extends root_1.HttpException {
    constructor(message, errors, errorCode) {
        super(message, errorCode, 500, errors);
    }
}
exports.InternalException = InternalException;
