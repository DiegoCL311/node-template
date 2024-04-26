import { Response } from "express";
import {
  ApiResponse,
  AuthFailureResponse,
  AccessTokenErrorResponse,
  InternalErrorResponse,
  NotFoundResponse,
  BadRequestResponse,
  ForbiddenResponse,
} from "./ApiResponse";

export enum ErrorType {
  BAD_TOKEN = "BadTokenError",
  TOKEN_EXPIRED = "TokenExpiredError",
  UNAUTHORIZED = "AuthFailureError",
  ACCESS_TOKEN = "AccessTokenError",
  INTERNAL = "InternalError",
  NOT_FOUND = "NotFoundError",
  NO_ENTRY = "NoEntryError",
  NO_DATA = "NoDataError",
  BAD_REQUEST = "BadRequestError",
  FORBIDDEN = "ForbiddenError",
}

export abstract class ApiError extends Error {
  constructor(public type: ErrorType, public message: string = "error") {
    super(type);
  }

  public abstract send(res: Response): void;
}

export class AuthFailureError extends ApiError {
  constructor(message = "Credenciales invalidas") {
    super(ErrorType.UNAUTHORIZED, message);
  }

  public send(res: Response): void {
    new AuthFailureResponse(res, this.message);
  }
}

export class InternalError extends ApiError {
  constructor(message = "Error interno del servidor") {
    super(ErrorType.INTERNAL, message);
  }

  public send(res: Response): void {
    new InternalErrorResponse(res, this.message);
  }
}

export class BadRequestError extends ApiError {
  constructor(message = "Bad Request") {
    super(ErrorType.BAD_REQUEST, message);
  }

  public send(res: Response): void {
    new BadRequestResponse(res, this.message);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Not Found") {
    super(ErrorType.NOT_FOUND, message);
  }

  public send(res: Response): void {
    new NotFoundResponse(res, this.message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Permiso denegado") {
    super(ErrorType.FORBIDDEN, message);
  }

  public send(res: Response): void {
    new ForbiddenResponse(res, this.message);
  }
}

export class NoEntryError extends ApiError {
  constructor(message = "Entry don't exists") {
    super(ErrorType.NO_ENTRY, message);
  }

  public send(res: Response): void {
    new NotFoundResponse(res, this.message);
  }
}

export class BadTokenError extends ApiError {
  constructor(message = "Token invalido") {
    super(ErrorType.BAD_TOKEN, message);
  }

  public send(res: Response): void {
    new BadRequestResponse(res, this.message);
  }
}

export class TokenExpiredError extends ApiError {
  constructor(message = "Token expirado") {
    super(ErrorType.TOKEN_EXPIRED, message);
  }

  public send(res: Response): void {
    new AuthFailureResponse(res, this.message);
  }
}

export class NoDataError extends ApiError {
  constructor(message = "No hay datos disponibles") {
    super(ErrorType.NO_DATA, message);
  }

  public send(res: Response): void {
    new NotFoundResponse(res, this.message);
  }
}

export class AccessTokenError extends ApiError {
  constructor(message = "Token de acceso invalido") {
    super(ErrorType.ACCESS_TOKEN, message);
  }

  public send(res: Response): void {
    new AccessTokenErrorResponse(res, this.message);
  }
}
