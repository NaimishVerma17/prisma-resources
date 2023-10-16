"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedException = void 0;
const root_1 = require("./root");
class UnauthorizedException extends root_1.HttpException {
    constructor(message, errorCode, errors) {
        super(message, errorCode, 401, errors);
    }
}
exports.UnauthorizedException = UnauthorizedException;
