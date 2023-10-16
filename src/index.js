"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaCilent = void 0;
const express_1 = __importDefault(require("express"));
const secrets_1 = require("./secrets");
const routes_1 = __importDefault(require("./routes"));
const client_1 = require("@prisma/client");
const errors_1 = require("./middlewares/errors");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api', routes_1.default);
exports.prismaCilent = new client_1.PrismaClient({
    log: ['query']
}).$extends({
    result: {
        address: {
            formattedAddress: {
                needs: {
                    lineOne: true,
                    lineTwo: true,
                    city: true,
                    country: true,
                    pincode: true
                },
                compute: (addr) => {
                    return `${addr.lineOne}, ${addr.lineTwo}, ${addr.city}, ${addr.country}-${addr.pincode}`;
                }
            }
        }
    }
});
app.use(errors_1.errorMiddleware);
app.listen(secrets_1.PORT, () => { console.log('App working!'); });
