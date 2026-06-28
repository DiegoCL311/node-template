import crypto from 'crypto';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { AuthFailureError } from '../../../src/core/ApiError';
import JWT from '../../../src/core/jwt';
import authMiddleware from '../../../src/middlewares/authMiddleware';
import * as usuarioRepository from '../../../src/repositories/usuarioRepository';

jest.mock('../../../src/core/jwt', () => ({
  __esModule: true,
  default: {
    encode: jest.fn(),
    validate: jest.fn(),
    decode: jest.fn(),
  },
}));
jest.mock('../../../src/repositories/usuarioRepository', () => ({
  __esModule: true,
  obtenerUsuarioByPk: jest.fn(),
}));
jest.mock('../../../src/loaders/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

const mockedJWT = JWT as jest.Mocked<typeof JWT>;
const mockedUsuarioRepository = usuarioRepository as jest.Mocked<typeof usuarioRepository>;

const buildReq = (authorization?: string): Request =>
  ({ headers: authorization ? { authorization } : {} }) as Request;

const buildRes = (): Response => ({}) as Response;

const invoke = async (req: Request, res: Response, next: jest.Mock): Promise<unknown> => {
  try {
    await authMiddleware(req, res, next);
    return undefined;
  } catch (err) {
    return err;
  }
};

describe('authMiddleware', () => {
  let next: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    next = jest.fn();
  });

  it('produces an AuthFailureError when Authorization header is missing', async () => {
    const req = buildReq();
    const res = buildRes();

    const thrown = await invoke(req, res, next);

    expect(thrown).toBeInstanceOf(AuthFailureError);
  });

  it('produces an AuthFailureError when Authorization header is malformed', async () => {
    const req = buildReq('NotBearer sometoken');
    const res = buildRes();

    const thrown = await invoke(req, res, next);

    expect(thrown).toBeInstanceOf(AuthFailureError);
  });

  it('passes an AuthFailureError to next when token is expired', async () => {
    mockedJWT.validate.mockRejectedValue(new Error('TokenExpiredError'));

    const req = buildReq('Bearer expired.token.value');
    const res = buildRes();

    await invoke(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AuthFailureError);
  });

  it('passes an AuthFailureError to next when token signature is invalid', async () => {
    mockedJWT.validate.mockRejectedValue(new Error('Invalid signature'));

    const req = buildReq('Bearer malformed.signature.value');
    const res = buildRes();

    await invoke(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AuthFailureError);
  });

  it('passes an AuthFailureError to next when usuario is not found', async () => {
    mockedJWT.validate.mockResolvedValue({
      iss: 'test-iss',
      sub: '999',
      aud: 'test-aud',
      prm: 'abc',
      iat: 0,
      exp: 0,
    });
    mockedUsuarioRepository.obtenerUsuarioByPk.mockResolvedValue(null);

    const req = buildReq('Bearer some.valid.token');
    const res = buildRes();

    await invoke(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AuthFailureError);
  });

  it('calls next() and attaches usuario to req when token is valid', async () => {
    const { privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
    });

    const token = jwt.sign(
      { iss: 'test-iss', sub: '1', aud: 'test-aud', prm: 'abc' },
      privateKey.export({ type: 'pkcs8', format: 'pem' }) as string,
      { algorithm: 'RS256', expiresIn: '1h' },
    );

    mockedJWT.validate.mockResolvedValue({
      iss: 'test-iss',
      sub: '1',
      aud: 'test-aud',
      prm: 'abc',
      iat: 0,
      exp: 0,
    });

    const mockUsuario = Object.freeze({
      nUsuario: 1,
      nRol: 1,
      nEstatus: 1,
      cNombres: 'John',
      cApellidos: 'Doe',
      cUsuario: 'johndoe',
    });

    mockedUsuarioRepository.obtenerUsuarioByPk.mockResolvedValue(mockUsuario);

    const req = buildReq(`Bearer ${token}`);
    const res = buildRes();

    await invoke(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect((req as any).usuario).toEqual(mockUsuario);
  });
});
