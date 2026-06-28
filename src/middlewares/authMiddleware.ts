import { Request, Response, NextFunction } from 'express';

import { ERROR_MESSAGES } from '../constants';
import { AuthFailureError, BadRequestError } from '../core/ApiError';
import JWT from '../core/jwt';
import * as usuarioRepository from '../repositories/usuarioRepository';
import { ProtectedRequest } from '../types/app-request';
import { getAccessToken } from '../utils/utils';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = getAccessToken(req.headers.authorization);

  try {
    const decodedToken = await JWT.validate(accessToken!);

    const usuario = await usuarioRepository.obtenerUsuarioByPk(Number(decodedToken.sub));

    if (!usuario) throw new BadRequestError(ERROR_MESSAGES.USER_NOT_FOUND);

    (req as ProtectedRequest).usuario = usuario;

    next();
  } catch (_error) {
    next(new AuthFailureError(ERROR_MESSAGES.AUTH_TOKEN_INVALID_RESPONSE));
  }
};

export default authMiddleware;
