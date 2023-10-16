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
exports.listUserOrders = exports.changeStatus = exports.listAllOrders = exports.getOrderById = exports.cancelOrder = exports.listOrders = exports.createOrder = void 0;
const __1 = require("..");
const not_found_1 = require("../exceptions/not-found");
const root_1 = require("../exceptions/root");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. to create a transaction
    // 2. to list all the cart items and proceed if cart is not empty
    // 3. calculate the total amount
    // 4. fetch address of user 
    // 5. to define computed field for formatted address on address module
    // 6. we will create a order and order productsorder products 
    // 7. create event
    // 8. to empty the cart
    return yield __1.prismaCilent.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const cartItems = yield tx.cartItem.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                product: true
            }
        });
        if (cartItems.length == 0) {
            return res.json({ message: "cart is empty" });
        }
        const price = cartItems.reduce((prev, current) => {
            return prev + (current.quantity * +current.product.price);
        }, 0);
        const address = yield tx.address.findFirst({
            where: {
                id: req.user.defaultShippingAddress
            }
        });
        const order = yield tx.order.create({
            data: {
                userId: req.user.id,
                netAmount: price,
                address: address.formattedAddress,
                products: {
                    create: cartItems.map((cart) => {
                        return {
                            productId: cart.productId,
                            quantity: cart.quantity
                        };
                    })
                }
            }
        });
        const orderEvent = yield tx.orderEvent.create({
            data: {
                orderId: order.id,
            }
        });
        yield tx.cartItem.deleteMany({
            where: {
                userId: req.user.id
            }
        });
        return res.json(order);
    }));
});
exports.createOrder = createOrder;
const listOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield __1.prismaCilent.order.findMany({
        where: {
            userId: req.user.id
        }
    });
    res.json(orders);
});
exports.listOrders = listOrders;
const cancelOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. wrap it inside tranaction
    // 2. check if the users is cancelling its own order
    try {
        const order = yield __1.prismaCilent.order.update({
            where: {
                id: +req.params.id
            },
            data: {
                status: 'CANCELLED'
            }
        });
        yield __1.prismaCilent.orderEvent.create({
            data: {
                orderId: order.id,
                status: "CANCELLED"
            }
        });
        res.json(order);
    }
    catch (err) {
        throw new not_found_1.NotFoundException('Order not found', root_1.ErrorCode.ORDER_NOT_FOUND);
    }
});
exports.cancelOrder = cancelOrder;
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield __1.prismaCilent.order.findFirstOrThrow({
            where: {
                id: +req.params.id
            },
            include: {
                products: true,
                events: true
            }
        });
        res.json(order);
    }
    catch (err) {
        throw new not_found_1.NotFoundException('Order not found', root_1.ErrorCode.ORDER_NOT_FOUND);
    }
});
exports.getOrderById = getOrderById;
const listAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let whereClause = {};
    const status = req.query.status;
    if (status) {
        whereClause = {
            status
        };
    }
    const orders = yield __1.prismaCilent.order.findMany({
        where: whereClause,
        skip: +req.query.skip || 0,
        take: 5
    });
    res.json(orders);
});
exports.listAllOrders = listAllOrders;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // wrap it inside transaction
    try {
        const order = yield __1.prismaCilent.order.update({
            where: {
                id: +req.params.id
            },
            data: {
                status: req.body.status
            }
        });
        yield __1.prismaCilent.orderEvent.create({
            data: {
                orderId: order.id,
                status: req.body.status
            }
        });
        res.json(order);
    }
    catch (err) {
        throw new not_found_1.NotFoundException('Order not found', root_1.ErrorCode.ORDER_NOT_FOUND);
    }
});
exports.changeStatus = changeStatus;
const listUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let whereClause = {
        userId: +req.params.id
    };
    const status = req.params.status;
    if (status) {
        whereClause = Object.assign(Object.assign({}, whereClause), { status });
    }
    const orders = yield __1.prismaCilent.order.findMany({
        where: whereClause,
        skip: +req.query.skip || 0,
        take: 5
    });
    res.json(orders);
});
exports.listUserOrders = listUserOrders;
