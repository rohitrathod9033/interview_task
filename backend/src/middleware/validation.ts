import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate = (schema: Joi.ObjectSchema) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            }, { abortEarly: false });
            return next();
        } catch (error) {
            if (error instanceof Joi.ValidationError) {
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
