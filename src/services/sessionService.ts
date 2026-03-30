import * as sessionRepository from "../repositories/sessionRepository";
import { ISesion } from "../models/sesion";
import { NotFoundError } from "../core/ApiError";

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
  if (!session) throw new NotFoundError("Sesión no encontrada");
  return session;
};

/**
 * Lógica de negocio para crear una sesión.
 */
export const registerNewSession = async (data: Omit<ISesion, "nSesion">): Promise<ISesion> => {
  // Aquí se podrían añadir validaciones de negocio extra
  return await sessionRepository.crearSesion(data);
};

/**
 * Lógica de negocio para actualizar una sesión.
 */
export const modifySession = async (id: number, data: Partial<ISesion>): Promise<ISesion> => {
  const session = await sessionRepository.obtenerSesionByPk(id);
  if (!session) throw new NotFoundError("Sesión no encontrada");

  return await sessionRepository.actualizarSesion(id, data);
};

/**
 * Lógica de negocio para eliminar una sesión.
 */
export const removeSession = async (id: number): Promise<void> => {
  const session = await sessionRepository.obtenerSesionByPk(id);
  if (!session) throw new NotFoundError("Sesión no encontrada");

  await sessionRepository.eliminarSesion(id);
};
