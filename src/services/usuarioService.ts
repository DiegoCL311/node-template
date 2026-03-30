import * as usuarioRepository from "../repositories/usuarioRepository";
import { IUsuario, IDataUsuario } from "../models/usuario";
import { BadRequestError, NotFoundError } from "../core/ApiError";

/**
 * Lógica de negocio para obtener todos los usuarios.
 */
export const fetchAllUsers = async (): Promise<IUsuario[]> => {
  return await usuarioRepository.obtenerTodosLosUsuarios();
};

/**
 * Lógica de negocio para obtener un usuario por PK.
 */
export const fetchUserByPk = async (id: number): Promise<IUsuario> => {
  const user = await usuarioRepository.obtenerUsuarioByPk(id);
  if (!user) throw new NotFoundError("Usuario no encontrado");
  return user;
};

/**
 * Lógica de negocio para crear un usuario.
 */
export const registerNewUser = async (data: IDataUsuario): Promise<IUsuario> => {
  const existing = await usuarioRepository.obtenerUsuarioFullByUsuario(data.cUsuario);
  if (existing) throw new BadRequestError("El nombre de usuario ya está registrado");

  return await usuarioRepository.crearUsuario(data);
};

/**
 * Lógica de negocio para actualizar un usuario.
 */
export const modifyUser = async (id: number, data: Partial<IDataUsuario>): Promise<IUsuario> => {
  const user = await usuarioRepository.obtenerUsuarioByPk(id);
  if (!user) throw new NotFoundError("Usuario no encontrado");

  return await usuarioRepository.actualizarUsuario(id, data);
};

/**
 * Lógica de negocio para eliminar un usuario.
 */
export const removeUser = async (id: number): Promise<void> => {
  const user = await usuarioRepository.obtenerUsuarioByPk(id);
  if (!user) throw new NotFoundError("Usuario no encontrado");

  await usuarioRepository.eliminarUsuario(id);
};
