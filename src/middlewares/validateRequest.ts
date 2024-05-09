import { Request, Response, NextFunction } from 'express';
import Joi, { Schema } from 'joi';
import { BadRequestError } from './../core/ApiError';

type RequestProp = 'body' | 'params' | 'query' | 'headers';

export function validateRequest(schema: Schema, option: RequestProp = 'body') {

    return (req: Request, res: Response, next: NextFunction) => {
        const toValidate = req[option];
        const { error } = schema.validate(toValidate, { abortEarly: false });
        if (error) {
            const message = error.details
                .map((i) => i.message.replace(/['"]+/g, ''))
                .join(', ');
            throw new BadRequestError(message);
        }
        next();
    };
}
