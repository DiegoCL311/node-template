import bcrypt from 'bcrypt';
import crypto from 'crypto';

import { ERROR_MESSAGES } from '../constants';
import { BadRequestError, AuthFailureError } from '../core/ApiError';
import JWT from '../core/jwt';
import { type IDataUsuario } from '../models/usuario';
import * as rolRepository from '../repositories/rolRepository';
import * as sesionRepository from '../repositories/sessionRepository';
import * as usuarioRepository from '../repositories/usuarioRepository';
import * as authUtils from '../utils/utils';

/**
 * Lógica de negocio para registro de usuarios
 */
export const registerUser = async (data: IDataUsuario) => {
  const { cNombres, cUsuario, cPassword, nRol, cApellidos } = data;

  const usuarioEncotrado = await usuarioRepository.obtenerUsuarioFullByUsuario(cUsuario);
  if (usuarioEncotrado) throw new BadRequestError(ERROR_MESSAGES.EMAIL_ALREADY_REGISTERED);

  const hashedPassword = await bcrypt.hash(cPassword, 10);

  return await usuarioRepository.crearUsuario({
    cNombres,
    cApellidos,
    cUsuario,
    cPassword: hashedPassword,
    nRol: nRol,
  });
};

/**
 * Lógica de negocio para inicio de sesión
 */
export const loginUser = async (cUsuario: string, cPassword: string) => {
  const usuario = await usuarioRepository.obtenerUsuarioFullByUsuario(cUsuario);

  if (!usuario) throw new AuthFailureError(ERROR_MESSAGES.INVALID_CREDENTIALS);
  if (usuario.nEstatus !== 1) throw new AuthFailureError(ERROR_MESSAGES.USER_INACTIVE);

  if (!(await bcrypt.compare(cPassword, usuario.cPassword))) {
    throw new AuthFailureError(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  const accessKey = crypto.randomBytes(16).toString('hex');
  const refreshKey = crypto.randomBytes(16).toString('hex');

  const { accessToken, refreshToken } = await authUtils.createTokens(
    usuario,
    accessKey,
    refreshKey,
  );

  await sesionRepository.crearSesion({
    nUsuario: usuario.nUsuario,
    accessKey,
    refreshKey,
    nEstatus: 1,
  });

  const rol = await rolRepository.obtenerRolByPk(usuario.nRol);

  return {
    accessToken,
    refreshToken,
    rol,
    usuario: {
      nUsuario: usuario.nUsuario,
      nRol: usuario.nRol,
      cNombres: usuario.cNombres,
      cApellidos: usuario.cApellidos,
      cUsuario: usuario.cUsuario,
    },
  };
};

/**
 * Lógica de negocio para cerrar sesión
 */
export const logoutUser = async (refreshToken: string) => {
  const payload = await JWT.validate(refreshToken);
  authUtils.validateTokenData(payload);
  // Aquí se podría invalidar la sesión en DB si fuera necesario
  // await sesionService.eliminarSesionByRefreshKey(payload.prm);
};

/**
 * Lógica de negocio para refrescar tokens
 */
export const refreshUserTokens = async (refreshToken: string) => {
  const payload = await JWT.validate(refreshToken);
  authUtils.validateTokenData(payload);

  const session = await sesionRepository.obtenerSesionByRefreshKey(payload.prm);
  if (!session) throw new AuthFailureError(ERROR_MESSAGES.SESSION_NOT_FOUND);

  const user = await usuarioRepository.obtenerUsuarioFullById(Number(payload.sub));
  if (!user) throw new AuthFailureError(ERROR_MESSAGES.USER_NOT_REGISTERED);

  const accessKey = crypto.randomBytes(16).toString('hex');

  // Rotar accessKey de la sesión (encapsulado en el data layer)
  await sesionRepository.rotarAccessKey(session.nSesion, accessKey);

  const accessToken = await authUtils.createAccessToken(user, accessKey);
  const rol = await rolRepository.obtenerRolByPk(user.nRol);

  return {
    accessToken,
    rol,
    usuario: {
      nUsuario: user.nUsuario,
      cNombres: user.cNombres,
      cApellidos: user.cApellidos,
      cUsuario: user.cUsuario,
      nRol: user.nRol,
    },
  };
};
