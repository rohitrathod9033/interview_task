"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentOrderParamsValidation = exports.createPaymentValidation = void 0;
const zod_1 = require("zod");
const validate_middleware_1 = require("../middleware/validate.middleware");
const createPaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        orderId: zod_1.z.string().length(24, 'Invalid order ID format'),
        amount: zod_1.z.number().positive('Amount must be positive'),
    })
});
const paymentOrderParamsSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().length(24, 'Invalid order ID format')
    })
});
exports.createPaymentValidation = (0, validate_middleware_1.validate)(createPaymentSchema);
exports.paymentOrderParamsValidation = (0, validate_middleware_1.validate)(paymentOrderParamsSchema);
