import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../core/ApiError'

export const notFoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const error = new NotFoundError(`Not Found - ${req.method} - ${req.originalUrl}`);
    next(error);
};
