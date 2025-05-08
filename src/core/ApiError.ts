import { Response } from 'express';
import { environment } from '../config';
import { ApiResponse, AuthFailureResponse, AccessTokenErrorResponse, InternalErrorResponse, NotFoundResponse, BadRequestResponse, ForbiddenResponse } from './ApiResponse';

export enum ErrorType {
  BAD_TOKEN = 'BadTokenError',
  TOKEN_EXPIRED = 'TokenExpiredError',
  UNAUTHORIZED = 'AuthFailureError',
  ACCESS_TOKEN = 'AccessTokenError',
  INTERNAL = 'InternalError',
  NOT_FOUND = 'NotFoundError',
  NO_ENTRY = 'NoEntryError',
  NO_DATA = 'NoDataError',
  BAD_REQUEST = 'BadRequestError',
  FORBIDDEN = 'ForbiddenError',
}

export abstract class ApiError extends Error {
  constructor(public type: ErrorType, public message: string = 'error') {
    super(type);
  }

  public abstract send(res: Response): number;
}

export class AuthFailureError extends ApiError {
  constructor(message = 'Invalid Credentials') {
    super(ErrorType.UNAUTHORIZED, message);
  }

  public send(res: Response<any, Record<string, any>>): number {
    const response = new AuthFailureResponse(this.message);
    response.send(res);
    return response.getStatus();
  }
}

export class InternalError extends ApiError {
  constructor(message = 'Internal error') {
    super(ErrorType.INTERNAL, message);
  }

  public send(res: Response<any, Record<string, any>>): number {
    const response = new InternalErrorResponse(process.env.NODE_ENV === 'production' ? 'Internal Error' : this.message);
    response.send(res);
    return response.getStatus();
  }
}

export class BadRequestError extends ApiError {
  constructor(message = 'Bad Request') {
    super(ErrorType.BAD_REQUEST, message);
  }

  public send(res: Response<any, Record<string, any>>): number {
    const response = new BadRequestResponse(this.message);
    response.send(res);
    return response.getStatus();
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Not Found') {
    super(ErrorType.NOT_FOUND, message);
  }

  public send(res: Response<any, Record<string, any>>): number {
    const response = new NotFoundResponse(this.message);
    response.send(res);
    return response.getStatus();
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Permission denied') {
    super(ErrorType.FORBIDDEN, message);
  }

  public send(res: Response<any, Record<string, any>>): number {
    const response = new ForbiddenResponse(this.message);
    response.send(res);
    return response.getStatus();
  }
}

export class NoEntryError extends ApiError {
  constructor(message = "Entry don't exists") {
    super(ErrorType.NO_ENTRY, message);
  }

  public send(res: Response<any, Record<string, any>>): number {
    const response = new NotFoundResponse(this.message);
    response.send(res);
    return response.getStatus();
  }
}

export class BadTokenError extends ApiError {
  constructor(message = 'Token is not valid') {
    super(ErrorType.BAD_TOKEN, message);
  }

  public send(res: Response<any, Record<string, any>>): number {
    const response = new BadRequestResponse(this.message);
    response.send(res);
    return response.getStatus();
  }
}

export class TokenExpiredError extends ApiError {
  constructor(message = 'Token is expired') {
    super(ErrorType.TOKEN_EXPIRED, message);
  }

  public send(res: Response<any, Record<string, any>>): number {
    const response = new AuthFailureResponse(this.message);
    response.send(res);
    return response.getStatus();
  }
}

export class NoDataError extends ApiError {
  constructor(message = 'No data available') {
    super(ErrorType.NO_DATA, message);
  }

  public send(res: Response<any, Record<string, any>>): number {
    const response = new NotFoundResponse(this.message);
    response.send(res);
    return response.getStatus();
  }
}

export class AccessTokenError extends ApiError {
  constructor(message = 'Invalid access token') {
    super(ErrorType.ACCESS_TOKEN, message);
  }

  public send(res: Response<any, Record<string, any>>): number {
    const response = new AccessTokenErrorResponse(this.message);
    response.send(res);
    return response.getStatus();
  }
}
