import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { BadRequestError } from './../core/ApiError';

type RequestProp = 'body' | 'params' | 'query' | 'headers';

export function validateRequest(schema: ZodSchema, option: RequestProp = 'body') {

    return (req: Request, res: Response, next: NextFunction) => {
        const datos = req[option];
        const resultado = schema.safeParse(datos);
        if (!resultado.success) {
            // Construir mensaje de error
            const mensaje = resultado.error.errors.map(err => err.message).join(', ');
            throw new BadRequestError(mensaje);
        }
        next();
    };
}
