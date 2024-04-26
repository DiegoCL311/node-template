import { Response } from "express";

enum ResponseStatus {
  SUCCESS = 200,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
}

export abstract class ApiResponse {
  constructor(
    protected response: Response,
    protected status: ResponseStatus,
    protected message: string,
    protected data?: any
  ) {
    this.response.status(status).json({ message, data });
  }

  public getStatus(): number {
    return this.status;
  }
}

export class AuthFailureResponse extends ApiResponse {
  constructor(response: Response, message = "Authenticacion fallida") {
    super(response, ResponseStatus.UNAUTHORIZED, message);
  }
}

export class NotFoundResponse extends ApiResponse {
  constructor(response: Response, message = "No encontrado") {
    super(response, ResponseStatus.NOT_FOUND, message);
  }
}

export class ForbiddenResponse extends ApiResponse {
  constructor(response: Response, message = "Prohibido") {
    super(response, ResponseStatus.FORBIDDEN, message);
  }
}

export class BadRequestResponse extends ApiResponse {
  constructor(response: Response, message = "Bad Parameters") {
    super(response, ResponseStatus.BAD_REQUEST, message);
  }
}

export class InternalErrorResponse extends ApiResponse {
  constructor(response: Response, message = "Error interno del servidor") {
    super(response, ResponseStatus.INTERNAL_ERROR, message);
  }
}

export class SuccessMsgResponse extends ApiResponse {
  constructor(response: Response, message: string) {
    super(response, ResponseStatus.SUCCESS, message);
  }
}

export class FailureMsgResponse extends ApiResponse {
  constructor(response: Response, message: string) {
    super(response, ResponseStatus.INTERNAL_ERROR, message);
  }
}

export class SuccessResponse<T> extends ApiResponse {
  constructor(response: Response, message: string, data: T) {
    super(response, ResponseStatus.SUCCESS, message, data);
  }
}

export class NoContentResponse<T> extends ApiResponse {
  constructor(response: Response, message: string = "No content") {
    super(response, ResponseStatus.NO_CONTENT, message);
  }
}

export class AccessTokenErrorResponse extends ApiResponse {
  constructor(response: Response, message = "Access token invalido") {
    super(response, ResponseStatus.UNAUTHORIZED, message);
  }
}

export class TokenRefreshResponse extends ApiResponse {
  constructor(
    response: Response,
    message: string,
    private accessToken: string,
    private refreshToken: string
  ) {
    super(response, ResponseStatus.SUCCESS, message);
    this.response.json({ message, data: { accessToken, refreshToken } });
  }
}
