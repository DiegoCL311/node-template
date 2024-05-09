import { Request, Response, NextFunction } from "express";
import { ApiError, InternalError } from "../core/ApiError";
import { logger } from "../loaders/logger";
import { ValidationError } from 'sequelize';

export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {

  //console.error(error);

  switch (true) {
    case error instanceof ApiError:
      error.send(res);
      break;

    case error instanceof ValidationError:
      new InternalError(error.errors.map((err) => err.message).join(",")).send(res);
      break;

    default:
      new InternalError("Error interno.").send(res);
      break;
  }

}
