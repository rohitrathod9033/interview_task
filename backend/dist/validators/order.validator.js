"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderIdValidation = exports.updateOrderValidation = exports.createOrderValidation = void 0;
const zod_1 = require("zod");
const validate_middleware_1 = require("../middleware/validate.middleware");
const createOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        clientName: zod_1.z.string().min(1, 'Client name is required'),
        eventDate: zod_1.z.string().datetime({ message: 'Invalid datetime format for eventDate' }),
        eventType: zod_1.z.string().min(1, 'Event type is required'),
        venue: zod_1.z.string().min(1, 'Venue is required'),
        totalAmount: zod_1.z.number().positive('Total amount must be greater than 0'),
        notes: zod_1.z.string().optional()
    })
});
const updateOrderSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().length(24, 'Invalid order ID format')
    }),
    body: zod_1.z.object({
        clientName: zod_1.z.string().min(1).optional(),
        eventDate: zod_1.z.string().datetime().optional(),
        eventType: zod_1.z.string().min(1).optional(),
        venue: zod_1.z.string().min(1).optional(),
        totalAmount: zod_1.z.number().positive().optional(),
        notes: zod_1.z.string().optional()
    })
});
const orderIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().length(24, 'Invalid order ID format')
    })
});
exports.createOrderValidation = (0, validate_middleware_1.validate)(createOrderSchema);
exports.updateOrderValidation = (0, validate_middleware_1.validate)(updateOrderSchema);
exports.orderIdValidation = (0, validate_middleware_1.validate)(orderIdSchema);
