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
exports.getCart = exports.changeQuantity = exports.deleteItemFromCart = exports.addItemToCart = void 0;
const cart_1 = require("../schema/cart");
const not_found_1 = require("../exceptions/not-found");
const root_1 = require("../exceptions/root");
const __1 = require("..");
const addItemToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check for the existence of the same product in user's cart and alter the quantity as required
    const validatedData = cart_1.CreateCartSchema.parse(req.body);
    let product;
    try {
        product = yield __1.prismaCilent.product.findFirstOrThrow({
            where: {
                id: validatedData.productId
            }
        });
    }
    catch (err) {
        throw new not_found_1.NotFoundException('Product not found!', root_1.ErrorCode.PRODUCT_NOT_FOUND);
    }
    const cart = yield __1.prismaCilent.cartItem.create({
        data: {
            userId: req.user.id,
            productId: product.id,
            quantity: validatedData.quantity
        }
    });
    res.json(cart);
});
exports.addItemToCart = addItemToCart;
const deleteItemFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user is deleting its own cart item
    yield __1.prismaCilent.cartItem.delete({
        where: {
            id: +req.params.id
        }
    });
    res.json({ success: true });
});
exports.deleteItemFromCart = deleteItemFromCart;
const changeQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user is updating its own cart item
    const validatedData = cart_1.ChangeQuantitySchema.parse(req.body);
    const updatedCart = yield __1.prismaCilent.cartItem.update({
        where: {
            id: +req.params.id
        },
        data: {
            quantity: validatedData.quantity
        }
    });
    res.json(updatedCart);
});
exports.changeQuantity = changeQuantity;
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield __1.prismaCilent.cartItem.findMany({
        where: {
            userId: req.user.id
        },
        include: {
            product: true
        }
    });
    res.json(cart);
});
exports.getCart = getCart;
