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
exports.changeUserRole = exports.getUserById = exports.listUsers = exports.updateUser = exports.listAddress = exports.deleteAddress = exports.addAddress = void 0;
const users_1 = require("../schema/users");
const __1 = require("..");
const not_found_1 = require("../exceptions/not-found");
const root_1 = require("../exceptions/root");
const bad_requests_1 = require("../exceptions/bad-requests");
const addAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    users_1.AddressSchema.parse(req.body);
    const address = yield __1.prismaCilent.address.create({
        data: Object.assign(Object.assign({}, req.body), { userId: req.user.id })
    });
    res.json(address);
});
exports.addAddress = addAddress;
const deleteAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield __1.prismaCilent.address.delete({
            where: {
                id: +req.params.id
            }
        });
        res.json({ success: true });
    }
    catch (err) {
        throw new not_found_1.NotFoundException('Address not found.', root_1.ErrorCode.ADDRESS_NOT_FOUND);
    }
});
exports.deleteAddress = deleteAddress;
const listAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const addresses = yield __1.prismaCilent.address.findMany({
        where: {
            userId: req.user.id
        }
    });
    res.json(addresses);
});
exports.listAddress = listAddress;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedData = users_1.UpdateUserSchema.parse(req.body);
    let shippingAddress;
    let billingAddress;
    console.log(validatedData);
    if (validatedData.defaultShippingAddress) {
        try {
            shippingAddress = yield __1.prismaCilent.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultShippingAddress
                }
            });
        }
        catch (error) {
            throw new not_found_1.NotFoundException('Address not found.', root_1.ErrorCode.ADDRESS_NOT_FOUND);
        }
        if (shippingAddress.userId != req.user.id) {
            throw new bad_requests_1.BadRequestsException('Address does not belong to user', root_1.ErrorCode.ADDRESS_DOES_NOT_BELONG);
        }
    }
    if (validatedData.defaultBillingAddress) {
        try {
            billingAddress = yield __1.prismaCilent.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultBillingAddress
                }
            });
        }
        catch (error) {
            throw new not_found_1.NotFoundException('Address not found.', root_1.ErrorCode.ADDRESS_NOT_FOUND);
        }
        if (billingAddress.userId != req.user.id) {
            throw new bad_requests_1.BadRequestsException('Address does not belong to user', root_1.ErrorCode.ADDRESS_DOES_NOT_BELONG);
        }
    }
    const updatedUser = yield __1.prismaCilent.user.update({
        where: {
            id: req.user.id
        },
        data: validatedData
    });
    res.json(updatedUser);
});
exports.updateUser = updateUser;
const listUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield __1.prismaCilent.user.findMany({
        skip: +req.query.skip || 0,
        take: 5
    });
    res.json(users);
});
exports.listUsers = listUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield __1.prismaCilent.user.findFirstOrThrow({
            where: {
                id: +req.params.id
            },
            include: {
                addresses: true
            }
        });
        res.json(user);
    }
    catch (err) {
        throw new not_found_1.NotFoundException('User not found.', root_1.ErrorCode.USER_NOT_FOUND);
    }
});
exports.getUserById = getUserById;
const changeUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validation 
    try {
        const user = yield __1.prismaCilent.user.update({
            where: {
                id: +req.params.id
            },
            data: {
                role: req.body.role
            }
        });
        res.json(user);
    }
    catch (err) {
        throw new not_found_1.NotFoundException('User not found.', root_1.ErrorCode.USER_NOT_FOUND);
    }
});
exports.changeUserRole = changeUserRole;
