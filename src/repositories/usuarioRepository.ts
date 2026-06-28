import { NoEntryError } from '../core/ApiError';
import Usuario from '../database/models/usuario';
import { type IDataUsuario, type IUsuario, type IUsuarioFull } from '../models/usuario';

/**
 * Obtiene registro completo de un usuario por `cUsuario` (incluye password).
 * Pensado para el flujo de login — NUNCA exponer `cPassword` fuera del data layer.
 *
 * @param {string} cUsuario – Usuario a buscar.
 * @returns {Readonly<IUsuarioFull> | null} – Usuario completo inmutable o null.
 */
export const obtenerUsuarioFullByUsuario = async (
  cUsuario: string,
): Promise<Readonly<IUsuarioFull> | null> => {
  const usuario = await Usuario.scope('withPassword').findOne({ where: { cUsuario } });
  return usuario ? usuario.toObjFull() : null;
};

/**
 * Busca un usuario por su clave primaria (DTO público).
 * @param {number} id – ID del usuario.
 * @returns {Readonly<IUsuario> | null} – Usuario público inmutable o null.
 */
export const obtenerUsuarioByPk = async (id: number): Promise<Readonly<IUsuario> | null> => {
  const usuario = await Usuario.findByPk(id);
  return usuario ? usuario.toObj() : null;
};

/**
 * Obtiene registro completo de un usuario por PK (incluye password y timestamps).
 * @param {number} id – ID del usuario a buscar.
 * @returns {Readonly<IUsuarioFull> | null} – Usuario completo inmutable o null.
 */
export const obtenerUsuarioFullById = async (
  id: number,
): Promise<Readonly<IUsuarioFull> | null> => {
  const usuario = await Usuario.scope('full').findByPk(id);
  return usuario ? usuario.toObjFull() : null;
};

/**
 * Crea un nuevo usuario.
 * @param {IDataUsuario} usuario – Datos para crear el usuario.
 * @returns {Readonly<IUsuario>} – Campos públicos del usuario creado, inmutables.
 */
export const crearUsuario = async (usuario: IDataUsuario): Promise<Readonly<IUsuario>> => {
  const usuarioInsertado = await Usuario.create(usuario);
  return usuarioInsertado.toObj();
};

/**
 * Actualiza campos de un usuario existente.
 * @param {number} nUsuario – ID del usuario a actualizar.
 * @param {Partial<IDataUsuario>} usuario – Campos opcionales a modificar.
 * @returns {Readonly<IUsuario>} – Usuario público actualizado e inmutable.
 * @throws {NoEntryError} – Si no se encuentra el usuario.
 */
export const actualizarUsuario = async (
  nUsuario: number,
  usuario: Partial<IDataUsuario>,
): Promise<Readonly<IUsuario>> => {
  const instancia = await Usuario.findByPk(nUsuario);
  if (!instancia) throw new NoEntryError('Usuario no encontrado');
  await instancia.update(usuario);
  return instancia.toObj();
};

/**
 * Elimina un usuario.
 */
export const eliminarUsuario = async (nUsuario: number): Promise<void> => {
  const instancia = await Usuario.findByPk(nUsuario);
  if (!instancia) throw new NoEntryError('Usuario no encontrado');
  await instancia.destroy();
};

/**
 * Obtiene todos los usuarios (DTO público).
 */
export const obtenerTodosLosUsuarios = async (): Promise<Readonly<IUsuario>[]> => {
  const usuarios = await Usuario.findAll();
  return usuarios.map((u) => u.toObj());
};
