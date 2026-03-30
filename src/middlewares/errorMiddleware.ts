import { Request, Response, NextFunction } from "express";
import { ApiError, InternalError } from "../core/ApiError";
import { logger } from "../loaders/logger";
import { ValidationError } from 'sequelize';
import { normalizeError } from "../utils/utils";
import { ProtectedRequest } from '../types/app-request';

export function errorMiddleware(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {

  const parsed = normalizeError(error);

  const context = {
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    userId: (req as ProtectedRequest).usuario?.nUsuario ?? null
  };

  switch (true) {

    case error instanceof ApiError:
      logger.warn({
        ...parsed,
        ...context
      });

      error.send(res);
      break;

    case error instanceof ValidationError:
      logger.warn({
        type: "ValidationError",
        message: error.errors.map(e => e.message).join(","),
        ...context
      });

      new InternalError(
        error.errors.map((err) => err.message).join(",")
      ).send(res);

      break;

    default:
      logger.error({
        ...parsed,
        ...context
      });

      new InternalError(`Error interno: ${parsed.message}`).send(res);
      break;
  }
}