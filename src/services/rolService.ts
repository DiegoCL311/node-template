import { ERROR_MESSAGES } from '../constants';
import { NotFoundError } from '../core/ApiError';
import { IRol, IRolInput } from '../models/roles';
import * as rolRepository from '../repositories/rolRepository';

/**
 * Lógica de negocio para obtener todos los roles.
 */
export const fetchAllRoles = async (): Promise<IRol[]> => {
  return await rolRepository.obtenerTodosLosRoles();
};

/**
 * Lógica de negocio para obtener un rol por PK.
 */
export const fetchRolByPk = async (id: number): Promise<IRol> => {
  const rol = await rolRepository.obtenerRolByPk(id);
  if (!rol) throw new NotFoundError(ERROR_MESSAGES.ROL_NOT_FOUND);
  return rol;
};

/**
 * Lógica de negocio para crear un rol.
 */
export const registerNewRol = async (data: IRolInput): Promise<IRol> => {
  // Aquí se podrían añadir validaciones de negocio extra
  return await rolRepository.crearRol(data);
};

/**
 * Lógica de negocio para actualizar un rol.
 */
export const modifyRol = async (id: number, data: Partial<IRolInput>): Promise<IRol> => {
  const rol = await rolRepository.obtenerRolByPk(id);
  if (!rol) throw new NotFoundError(ERROR_MESSAGES.ROL_NOT_FOUND);

  return await rolRepository.actualizarRol(id, data);
};

/**
 * Lógica de negocio para eliminar un rol.
 */
export const removeRol = async (id: number): Promise<void> => {
  const rol = await rolRepository.obtenerRolByPk(id);
  if (!rol) throw new NotFoundError(ERROR_MESSAGES.ROL_NOT_FOUND);

  await rolRepository.eliminarRol(id);
};
