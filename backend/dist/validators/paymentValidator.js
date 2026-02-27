"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentOrderParamsValidation = exports.createPaymentValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const validation_1 = require("../middleware/validation");
const createPaymentSchema = joi_1.default.object({
    body: joi_1.default.object({
        orderId: joi_1.default.string().length(24).required().messages({ 'string.length': 'Invalid order ID format' }),
        amount: joi_1.default.number().positive().required().messages({ 'number.positive': 'Amount must be positive' }),
    }).unknown(true),
    query: joi_1.default.any(),
    params: joi_1.default.any()
});
const paymentOrderParamsSchema = joi_1.default.object({
    params: joi_1.default.object({
        id: joi_1.default.string().length(24).required().messages({ 'string.length': 'Invalid order ID format' })
    }).unknown(true),
    body: joi_1.default.any(),
    query: joi_1.default.any()
});
exports.createPaymentValidation = (0, validation_1.validate)(createPaymentSchema);
exports.paymentOrderParamsValidation = (0, validation_1.validate)(paymentOrderParamsSchema);
