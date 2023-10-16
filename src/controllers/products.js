"use strict";
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
exports.searchProducts = exports.getProductById = exports.listProducts = exports.deleteProduct = exports.updateProduct = exports.createProduct = void 0;
const __1 = require("..");
const not_found_1 = require("../exceptions/not-found");
const root_1 = require("../exceptions/root");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ["tea","india"] => "tea,india"
    // Create a validator to for this request
    const product = yield __1.prismaCilent.product.create({
        data: Object.assign(Object.assign({}, req.body), { tags: req.body.tags.join(',') })
    });
    res.json(product);
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = req.body;
        if (product.tags) {
            product.tags = product.tags.join(',');
        }
        const updateProduct = yield __1.prismaCilent.product.update({
            where: {
                id: +req.params.id
            },
            data: product
        });
        res.json(updateProduct);
    }
    catch (err) {
        throw new not_found_1.NotFoundException('Product not found.', root_1.ErrorCode.PRODUCT_NOT_FOUND);
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Assignment
});
exports.deleteProduct = deleteProduct;
const listProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // {
    //     count: 100,
    //     data: []
    // }
    const count = yield __1.prismaCilent.product.count();
    const products = yield __1.prismaCilent.product.findMany({
        skip: +req.query.skip || 0,
        take: 5
    });
    res.json({
        count, data: products
    });
});
exports.listProducts = listProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield __1.prismaCilent.product.findFirstOrThrow({
            where: {
                id: +req.params.id
            }
        });
        res.json(product);
    }
    catch (err) {
        console.log(err);
        throw new not_found_1.NotFoundException('Product not found.', root_1.ErrorCode.PRODUCT_NOT_FOUND);
    }
});
exports.getProductById = getProductById;
const searchProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // implement pagination here
    const products = yield __1.prismaCilent.product.findMany({
        where: {
            name: {
                search: req.query.q.toString()
            },
            description: {
                search: req.query.q.toString()
            },
            tags: {
                search: req.query.q.toString()
            },
        }
    });
    res.json(products);
});
exports.searchProducts = searchProducts;
