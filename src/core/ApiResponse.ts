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
    protected message: string
  ) {
    this.response.status(status).json({ message });
  }

  public getStatus(): number {
    return this.status;
  }
}

export class AuthFailureResponse extends ApiResponse {
  constructor(response: Response, message = "Authentication Failure") {
    super(response, ResponseStatus.UNAUTHORIZED, message);
  }
}

export class NotFoundResponse extends ApiResponse {
  constructor(response: Response, message = "Not Found") {
    super(response, ResponseStatus.NOT_FOUND, message);
  }
}

export class ForbiddenResponse extends ApiResponse {
  constructor(response: Response, message = "Forbidden") {
    super(response, ResponseStatus.FORBIDDEN, message);
  }
}

export class BadRequestResponse extends ApiResponse {
  constructor(response: Response, message = "Bad Parameters") {
    super(response, ResponseStatus.BAD_REQUEST, message);
  }
}

export class InternalErrorResponse extends ApiResponse {
  constructor(response: Response, message = "Internal Error") {
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
  constructor(response: Response, message: string, private data: T) {
    super(response, ResponseStatus.SUCCESS, message);
    this.response.json({ message, data });
  }
}

export class NoContentResponse<T> extends ApiResponse {
  constructor(response: Response, message: string = "No content") {
    super(response, ResponseStatus.NO_CONTENT, message);
  }
}

export class AccessTokenErrorResponse extends ApiResponse {
  private instruction = "refresh_token";

  constructor(response: Response, message = "Access token invalid") {
    super(response, ResponseStatus.UNAUTHORIZED, message);
    response.append("instruction", this.instruction);
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
