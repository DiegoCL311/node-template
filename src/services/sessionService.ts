import { ERROR_MESSAGES } from '../constants';
import { NotFoundError } from '../core/ApiError';
import { ISesion, ISesionInput } from '../models/sesion';
import * as sessionRepository from '../repositories/sessionRepository';

/**
 * Lógica de negocio para obtener todas las sesiones.
 */
export const fetchAllSessions = async (): Promise<ISesion[]> => {
  return await sessionRepository.obtenerTodasLasSesiones();
};

/**
 * Lógica de negocio para obtener una sesión por PK.
 */
export const fetchSessionByPk = async (id: number): Promise<ISesion> => {
  const session = await sessionRepository.obtenerSesionByPk(id);
  if (!session) throw new NotFoundError(ERROR_MESSAGES.SESION_NOT_FOUND);
  return session;
};

/**
 * Lógica de negocio para crear una sesión.
 */
export const registerNewSession = async (data: Omit<ISesionInput, 'nSesion'>): Promise<ISesion> => {
  // Aquí se podrían añadir validaciones de negocio extra
  return await sessionRepository.crearSesion(data);
};

/**
 * Lógica de negocio para actualizar una sesión.
 */
export const modifySession = async (id: number, data: Partial<ISesionInput>): Promise<ISesion> => {
  const session = await sessionRepository.obtenerSesionByPk(id);
  if (!session) throw new NotFoundError(ERROR_MESSAGES.SESION_NOT_FOUND);

  return await sessionRepository.actualizarSesion(id, data);
};

/**
 * Lógica de negocio para eliminar una sesión.
 */
export const removeSession = async (id: number): Promise<void> => {
  const session = await sessionRepository.obtenerSesionByPk(id);
  if (!session) throw new NotFoundError(ERROR_MESSAGES.SESION_NOT_FOUND);

  await sessionRepository.eliminarSesion(id);
};
