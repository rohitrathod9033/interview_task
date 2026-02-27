import Joi from 'joi';
import { validate } from '../middleware/validation';

const createPaymentSchema = Joi.object({
    body: Joi.object({
        orderId: Joi.string().length(24).required().messages({ 'string.length': 'Invalid order ID format' }),
        amount: Joi.number().positive().required().messages({ 'number.positive': 'Amount must be positive' }),
    }).unknown(true),
    query: Joi.any(),
    params: Joi.any()
});

const paymentOrderParamsSchema = Joi.object({
    params: Joi.object({
        id: Joi.string().length(24).required().messages({ 'string.length': 'Invalid order ID format' })
    }).unknown(true),
    body: Joi.any(),
    query: Joi.any()
});

export const createPaymentValidation = validate(createPaymentSchema);
export const paymentOrderParamsValidation = validate(paymentOrderParamsSchema);
