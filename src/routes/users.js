"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const error_handler_1 = require("../error-handler");
const auth_1 = __importDefault(require("../middlewares/auth"));
const users_1 = require("../controllers/users");
const admin_1 = __importDefault(require("../middlewares/admin"));
const usersRoutes = (0, express_1.Router)();
usersRoutes.post('/address', [auth_1.default], (0, error_handler_1.errorHandler)(users_1.addAddress));
usersRoutes.delete('/address/:id', [auth_1.default], (0, error_handler_1.errorHandler)(users_1.deleteAddress));
usersRoutes.get('/address', [auth_1.default], (0, error_handler_1.errorHandler)(users_1.listAddress));
usersRoutes.put('/', [auth_1.default], (0, error_handler_1.errorHandler)(users_1.updateUser));
usersRoutes.put('/:id/role', [auth_1.default, admin_1.default], (0, error_handler_1.errorHandler)(users_1.changeUserRole));
usersRoutes.get('/', [auth_1.default, admin_1.default], (0, error_handler_1.errorHandler)(users_1.listUsers));
usersRoutes.get('/:id', [auth_1.default, admin_1.default], (0, error_handler_1.errorHandler)(users_1.getUserById));
exports.default = usersRoutes;
