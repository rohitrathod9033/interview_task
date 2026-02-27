import Joi from 'joi';
import { validate } from '../middleware/validation';

const createOrderSchema = Joi.object({
    body: Joi.object({
        clientName: Joi.string().min(1).required().messages({ 'any.required': 'Client name is required' }),
        eventDate: Joi.date().iso().required().messages({ 'date.format': 'Invalid datetime format for eventDate' }),
        eventType: Joi.string().min(1).required().messages({ 'any.required': 'Event type is required' }),
        venue: Joi.string().min(1).required().messages({ 'any.required': 'Venue is required' }),
        totalAmount: Joi.number().positive().required().messages({ 'number.positive': 'Total amount must be greater than 0' }),
        notes: Joi.string().optional().allow('')
    }).unknown(true),
    query: Joi.any(),
    params: Joi.any()
});

const updateOrderSchema = Joi.object({
    params: Joi.object({
        id: Joi.string().length(24).required().messages({ 'string.length': 'Invalid order ID format' })
    }).unknown(true),
    body: Joi.object({
        clientName: Joi.string().min(1).optional(),
        eventDate: Joi.date().iso().optional(),
        eventType: Joi.string().min(1).optional(),
        venue: Joi.string().min(1).optional(),
        totalAmount: Joi.number().positive().optional(),
        notes: Joi.string().optional().allow('')
    }).unknown(true),
    query: Joi.any()
});

const orderIdSchema = Joi.object({
    params: Joi.object({
        id: Joi.string().length(24).required().messages({ 'string.length': 'Invalid order ID format' })
    }).unknown(true),
    body: Joi.any(),
    query: Joi.any()
});

export const createOrderValidation = validate(createOrderSchema);
export const updateOrderValidation = validate(updateOrderSchema);
export const orderIdValidation = validate(orderIdSchema);
