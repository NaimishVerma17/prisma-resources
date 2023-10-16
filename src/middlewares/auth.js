"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const unauthorized_1 = require("../exceptions/unauthorized");
const root_1 = require("../exceptions/root");
const jwt = __importStar(require("jsonwebtoken"));
const secrets_1 = require("../secrets");
const __1 = require("..");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. extract the token from header
    const token = req.headers.authorization;
    // 2. if token is not present, throw an error of unauthorized
    if (!token) {
        next(new unauthorized_1.UnauthorizedException('Unauthorized', root_1.ErrorCode.UNAUTHORIZED));
    }
    try {
        // 3. if the token is present, verify that token and extract the payload
        const payload = jwt.verify(token, secrets_1.JWT_SECRET);
        // 4. to get the user from the payload
        const user = yield __1.prismaCilent.user.findFirst({ where: { id: payload.userId } });
        if (!user) {
            next(new unauthorized_1.UnauthorizedException('Unauthorized', root_1.ErrorCode.UNAUTHORIZED));
        }
        // 5. to attach the user to the current request obejct
        req.user = user;
        next();
    }
    catch (error) {
        next(new unauthorized_1.UnauthorizedException('Unauthorized', root_1.ErrorCode.UNAUTHORIZED));
    }
});
exports.default = authMiddleware;
