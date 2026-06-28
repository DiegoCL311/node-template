import cookieParser from 'cookie-parser';
import express from 'express';
import request from 'supertest';
import { z } from 'zod';

import authRouter from '../../../src/controllers/auth';
import { BadRequestError, AuthFailureError } from '../../../src/core/ApiError';
import { errorMiddleware } from '../../../src/middlewares/errorMiddleware';
import * as authService from '../../../src/services/authService';

jest.mock('../../../src/services/authService', () => ({
  registerUser: jest.fn(),
  loginUser: jest.fn(),
  logoutUser: jest.fn(),
  refreshUserTokens: jest.fn(),
}));
jest.mock('../../../src/loaders/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));
jest.mock('../../../src/repositories/usuarioRepository', () => ({
  obtenerTodosLosUsuarios: jest.fn(),
  obtenerUsuarioByPk: jest.fn(),
  obtenerUsuarioFullByUsuario: jest.fn(),
  obtenerUsuarioFullById: jest.fn(),
  crearUsuario: jest.fn(),
  actualizarUsuario: jest.fn(),
  eliminarUsuario: jest.fn(),
}));
jest.mock('../../../src/repositories/sessionRepository', () => ({
  obtenerSesionByPk: jest.fn(),
  obtenerSesionByRefreshKey: jest.fn(),
  obtenerSesionFullById: jest.fn(),
  crearSesion: jest.fn(),
  actualizarSesion: jest.fn(),
  eliminarSesion: jest.fn(),
  obtenerTodasLasSesiones: jest.fn(),
}));
jest.mock('../../../src/repositories/rolRepository', () => ({
  obtenerRolByPk: jest.fn(),
  obtenerRolFullById: jest.fn(),
  crearRol: jest.fn(),
  actualizarRol: jest.fn(),
  eliminarRol: jest.fn(),
  obtenerTodosLosRoles: jest.fn(),
}));

jest.mock('../../../src/models/usuario', () => ({
  usuarioSchema: z.object({
    nRol: z.number().min(1),
    cNombres: z.string().min(3).max(50),
    cApellidos: z.string().min(3).max(50),
    cUsuario: z.string().max(100),
    cPassword: z.string().min(6).max(255),
  }),
  loginSchema: z.object({
    cUsuario: z.string().max(100),
    cPassword: z.string().min(6).max(255),
  }),
}));

const mockedAuthService = authService as jest.Mocked<typeof authService>;

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use('/api/v1/auth', authRouter);
  app.use(errorMiddleware);
  return app;
};

// eslint-disable-next-line max-lines-per-function
describe('Auth Controller', () => {
  let app: express.Express;

  beforeEach(() => {
    jest.clearAllMocks();
    app = buildApp();
  });

  const validRegisterBody = {
    nRol: 1,
    cNombres: 'John',
    cApellidos: 'Doe',
    cUsuario: 'johndoe',
    cPassword: 'securepassword',
  };

  const validLoginBody = {
    cUsuario: 'johndoe',
    cPassword: 'securepassword',
  };

  describe('POST /api/v1/auth/register', () => {
    it('returns 200 with "Registro exitoso" message on valid body', async () => {
      mockedAuthService.registerUser.mockResolvedValue({
        nUsuario: 1,
        nRol: 1,
        nEstatus: 1,
        cNombres: 'John',
        cApellidos: 'Doe',
        cUsuario: 'johndoe',
      });

      const response = await request(app).post('/api/v1/auth/register').send(validRegisterBody);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Registro exitoso');
      expect(mockedAuthService.registerUser).toHaveBeenCalledWith(validRegisterBody);
    });

    it('returns 400 on invalid body', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({});

      expect(response.status).toBe(400);
      expect(mockedAuthService.registerUser).not.toHaveBeenCalled();
    });

    it('returns 400 when cPassword is too short', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({ ...validRegisterBody, cPassword: '123' });

      expect(response.status).toBe(400);
      expect(mockedAuthService.registerUser).not.toHaveBeenCalled();
    });

    it('returns 400 when service throws BadRequestError', async () => {
      mockedAuthService.registerUser.mockRejectedValue(new BadRequestError('Email ya registrado'));

      const response = await request(app).post('/api/v1/auth/register').send(validRegisterBody);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Email ya registrado');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('returns 200 with accessToken on valid credentials', async () => {
      mockedAuthService.loginUser.mockResolvedValue({
        accessToken: 'mock.access.token',
        refreshToken: 'mock.refresh.token',
        rol: { nRol: 1, cRol: 'admin' },
        usuario: {
          nUsuario: 1,
          nRol: 1,
          cNombres: 'John',
          cApellidos: 'Doe',
          cUsuario: 'johndoe',
        },
      });

      const response = await request(app).post('/api/v1/auth/login').send(validLoginBody);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Inicio de sesion exitoso');
      expect(response.body.data).toHaveProperty('accessToken', 'mock.access.token');
      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie']?.[0]).toMatch(/refreshToken=/);
      expect(mockedAuthService.loginUser).toHaveBeenCalledWith(
        validLoginBody.cUsuario,
        validLoginBody.cPassword,
      );
    });

    it('returns 400 on empty body', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({});

      expect(response.status).toBe(400);
      expect(mockedAuthService.loginUser).not.toHaveBeenCalled();
    });

    it('returns 401 on invalid credentials', async () => {
      mockedAuthService.loginUser.mockRejectedValue(new AuthFailureError('Credenciales inválidas'));

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ cUsuario: 'unknown', cPassword: 'badpass1' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Credenciales inválidas');
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('clears the refreshToken cookie', async () => {
      mockedAuthService.logoutUser.mockResolvedValue(undefined);

      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('Cookie', ['refreshToken=some.token.value']);

      expect(response.status).toBe(204);
      expect(mockedAuthService.logoutUser).toHaveBeenCalledWith('some.token.value');
      const setCookie = response.headers['set-cookie'];
      expect(setCookie).toBeDefined();
      const cookieStr = Array.isArray(setCookie) ? setCookie.join(';') : setCookie;
      expect(cookieStr).toMatch(/refreshToken=/);
    });

    it('does not call service when refresh token cookie is missing', async () => {
      const response = await request(app).post('/api/v1/auth/logout');

      expect(response.status).toBe(204);
      expect(mockedAuthService.logoutUser).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/v1/auth/refresh-token', () => {
    it('returns 200 with a new accessToken when refresh cookie is present', async () => {
      mockedAuthService.refreshUserTokens.mockResolvedValue({
        accessToken: 'new.access.token',
        rol: { nRol: 1, cRol: 'admin' },
        usuario: {
          nUsuario: 1,
          cNombres: 'John',
          cApellidos: 'Doe',
          cUsuario: 'johndoe',
          nRol: 1,
        },
      });

      const response = await request(app)
        .get('/api/v1/auth/refresh-token')
        .set('Cookie', ['refreshToken=valid.refresh.token']);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Access refreshed successfully');
      expect(response.body.data).toHaveProperty('accessToken', 'new.access.token');
      expect(mockedAuthService.refreshUserTokens).toHaveBeenCalledWith('valid.refresh.token');
    });

    it('returns 401 when refresh cookie is missing', async () => {
      const response = await request(app).get('/api/v1/auth/refresh-token');

      expect(response.status).toBe(401);
      expect(mockedAuthService.refreshUserTokens).not.toHaveBeenCalled();
    });
  });
});
