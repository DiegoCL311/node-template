import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'sequelize';

import { ApiError, InternalError } from '../core/ApiError';
import { logger } from '../loaders/logger';
import { ProtectedRequest } from '../types/app-request';
import { normalizeError } from '../utils/utils';

export function errorMiddleware(error: unknown, req: Request, res: Response, _next: NextFunction) {
  const parsed = normalizeError(error);

  const context = {
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    userId: (req as ProtectedRequest).usuario?.nUsuario ?? null,
  };

  if (error instanceof ApiError) {
    logger.warn({
      ...parsed,
      ...context,
    });

    error.send(res);
    return;
  }

  if (error instanceof ValidationError) {
    logger.warn({
      type: 'ValidationError',
      message: error.errors.map((e) => e.message).join(','),
      ...context,
    });

    new InternalError(error.errors.map((err) => err.message).join(',')).send(res);
    return;
  }

  logger.error({
    ...parsed,
    ...context,
  });

  new InternalError(`Error interno: ${parsed.message}`).send(res);
}
