import { Request, Response, NextFunction } from "express";
import { ApiError, InternalError } from "../../core/ApiError";
import { logger } from "../../loaders/logger";

export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(error.message);

  error instanceof ApiError ? error.send(res) : new InternalError().send(res);
}
