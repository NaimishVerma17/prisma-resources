"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const error_handler_1 = require("../error-handler");
const products_1 = require("../controllers/products");
const auth_1 = __importDefault(require("../middlewares/auth"));
const admin_1 = __importDefault(require("../middlewares/admin"));
const productsRoutes = (0, express_1.Router)();
productsRoutes.post('/', [auth_1.default, admin_1.default], (0, error_handler_1.errorHandler)(products_1.createProduct));
productsRoutes.put('/:id', [auth_1.default, admin_1.default], (0, error_handler_1.errorHandler)(products_1.updateProduct));
productsRoutes.delete('/:id', [auth_1.default, admin_1.default], (0, error_handler_1.errorHandler)(products_1.deleteProduct));
productsRoutes.get('/', [auth_1.default, admin_1.default], (0, error_handler_1.errorHandler)(products_1.listProducts));
productsRoutes.get('/search', [auth_1.default], (0, error_handler_1.errorHandler)(products_1.searchProducts));
productsRoutes.get('/:id', [auth_1.default, admin_1.default], (0, error_handler_1.errorHandler)(products_1.getProductById));
exports.default = productsRoutes;
