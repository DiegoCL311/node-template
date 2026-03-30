import * as rolRepository from "../repositories/rolRepository";
import { IRol } from "../models/roles";
import { NotFoundError } from "../core/ApiError";

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
  if (!rol) throw new NotFoundError("Rol no encontrado");
  return rol;
};

/**
 * Lógica de negocio para crear un rol.
 */
export const registerNewRol = async (data: IRol): Promise<IRol> => {
  // Aquí se podrían añadir validaciones de negocio extra
  return await rolRepository.crearRol(data);
};

/**
 * Lógica de negocio para actualizar un rol.
 */
export const modifyRol = async (id: number, data: Partial<IRol>): Promise<IRol> => {
  const rol = await rolRepository.obtenerRolByPk(id);
  if (!rol) throw new NotFoundError("Rol no encontrado");

  return await rolRepository.actualizarRol(id, data);
};

/**
 * Lógica de negocio para eliminar un rol.
 */
export const removeRol = async (id: number): Promise<void> => {
  const rol = await rolRepository.obtenerRolByPk(id);
  if (!rol) throw new NotFoundError("Rol no encontrado");

  await rolRepository.eliminarRol(id);
};
