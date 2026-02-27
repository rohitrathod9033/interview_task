"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderIdValidation = exports.updateOrderValidation = exports.createOrderValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const validation_1 = require("../middleware/validation");
const createOrderSchema = joi_1.default.object({
    body: joi_1.default.object({
        clientName: joi_1.default.string().min(1).required().messages({ 'any.required': 'Client name is required' }),
        eventDate: joi_1.default.date().iso().required().messages({ 'date.format': 'Invalid datetime format for eventDate' }),
        eventType: joi_1.default.string().min(1).required().messages({ 'any.required': 'Event type is required' }),
        venue: joi_1.default.string().min(1).required().messages({ 'any.required': 'Venue is required' }),
        totalAmount: joi_1.default.number().positive().required().messages({ 'number.positive': 'Total amount must be greater than 0' }),
        notes: joi_1.default.string().optional().allow('')
    }).unknown(true),
    query: joi_1.default.any(),
    params: joi_1.default.any()
});
const updateOrderSchema = joi_1.default.object({
    params: joi_1.default.object({
        id: joi_1.default.string().length(24).required().messages({ 'string.length': 'Invalid order ID format' })
    }).unknown(true),
    body: joi_1.default.object({
        clientName: joi_1.default.string().min(1).optional(),
        eventDate: joi_1.default.date().iso().optional(),
        eventType: joi_1.default.string().min(1).optional(),
        venue: joi_1.default.string().min(1).optional(),
        totalAmount: joi_1.default.number().positive().optional(),
        notes: joi_1.default.string().optional().allow('')
    }).unknown(true),
    query: joi_1.default.any()
});
const orderIdSchema = joi_1.default.object({
    params: joi_1.default.object({
        id: joi_1.default.string().length(24).required().messages({ 'string.length': 'Invalid order ID format' })
    }).unknown(true),
    body: joi_1.default.any(),
    query: joi_1.default.any()
});
exports.createOrderValidation = (0, validation_1.validate)(createOrderSchema);
exports.updateOrderValidation = (0, validation_1.validate)(updateOrderSchema);
exports.orderIdValidation = (0, validation_1.validate)(orderIdSchema);
