import config from '../config';
import { ERROR_MESSAGES } from '../constants';
import { ApiError, AuthFailureError, InternalError } from '../core/ApiError';
import JWT, { JwtPayload } from '../core/jwt';
import { IUsuario } from '../models/usuario';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export const getAccessToken = (authorization?: string) => {
  if (!authorization || !authorization.startsWith('Bearer '))
    throw new AuthFailureError(ERROR_MESSAGES.AUTH_TOKEN_MISSING_INVALID);
  return authorization.split(' ')[1];
};

export const validateTokenData = (payload: JwtPayload): boolean => {
  if (
    !payload ||
    !payload.iss ||
    !payload.sub ||
    !payload.aud ||
    !payload.prm ||
    payload.iss !== config.jwt.issuer ||
    payload.aud !== config.jwt.audience
  )
    throw new AuthFailureError(ERROR_MESSAGES.AUTH_TOKEN_INVALID);

  return true;
};

export const createTokens = async (
  usuario: IUsuario,
  accessKey: string,
  refreshKey: string,
): Promise<Tokens> => {
  const accessToken = await JWT.encode(
    new JwtPayload(
      /* issuer */ config.jwt.issuer,
      /* audience */ config.jwt.audience,
      /* subject */ usuario.nUsuario?.toString() || '0',
      accessKey,
    ),
  );

  if (!accessToken) throw new InternalError();

  const refreshToken = await JWT.encode(
    new JwtPayload(
      /* issuer */ config.jwt.issuer,
      /* audience */ config.jwt.audience,
      /* subject */ usuario.nUsuario?.toString() || '0',
      refreshKey,
    ),
  );

  if (!refreshToken) throw new InternalError();

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  } as Tokens;
};

export const createAccessToken = async (usuario: IUsuario, accessKey: string): Promise<string> => {
  return await JWT.encode(
    new JwtPayload(
      config.jwt.issuer,
      config.jwt.audience,
      usuario.nUsuario?.toString() || '0',
      accessKey,
    ),
  );
};

export function normalizeError(err: unknown) {
  if (err instanceof ApiError) {
    return {
      type: err.type,
      message: err.message,
      stack: err.stack,
    };
  }

  if (err instanceof Error) {
    return {
      message: err.message,
      stack: err.stack,
      name: err.name,
    };
  }

  if (typeof err === 'string') {
    return {
      message: err,
    };
  }

  if (typeof err === 'object' && err !== null) {
    return {
      message: 'Non-Error object thrown',
      details: err,
    };
  }

  return {
    message: String(err),
  };
}
