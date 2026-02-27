"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const joi_1 = __importDefault(require("joi"));
const validate = (schema) => async (req, res, next) => {
    try {
        await schema.validateAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        }, { abortEarly: false });
        return next();
    }
    catch (error) {
        if (error instanceof joi_1.default.ValidationError) {
            return res.status(400).json({
                error: 'Validation failed',
                details: error.details.map((e) => ({
                    path: e.path.join('.'),
                    message: e.message
                }))
            });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.validate = validate;
