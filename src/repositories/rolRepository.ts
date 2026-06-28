import { NoEntryError } from '../core/ApiError';
import Rol from '../database/models/roles';
import { type IRol, type IRolFull, type IRolInput } from '../models/roles';

/**
 * Busca un Rol por su clave primaria.
 * @param {number} nRol – ID del Rol.
 * @returns {Readonly<IRol> | null} – Rol inmutable o null.
 */
export const obtenerRolByPk = async (nRol: number): Promise<Readonly<IRol> | null> => {
  const rol = await Rol.findByPk(nRol);
  return rol ? rol.toObj() : null;
};

/**
 * Obtiene registro completo de un Rol (incluye timestamps).
 * @param {number} id – ID del Rol a buscar.
 * @returns {Readonly<IRolFull> | null} – Rol completo inmutable o null.
 */
export const obtenerRolFullById = async (id: number): Promise<Readonly<IRolFull> | null> => {
  const rol = await Rol.scope('full').findByPk(id);
  return rol ? rol.toObjFull() : null;
};

/**
 * Crea un nuevo Rol.
 * @param {IRolInput} Rol – Datos para crear el Rol.
 * @returns {Readonly<IRol>} – Rol público inmutable.
 */
export const crearRol = async (rol: IRolInput): Promise<Readonly<IRol>> => {
  const rolInsertado = await Rol.create(rol);
  return rolInsertado.toObj();
};

/**
 * Actualiza campos de un Rol existente.
 * @param {number} nRol – ID del Rol a actualizar.
 * @param {Partial<IRolInput>} rol – Campos opcionales a modificar.
 * @returns {Readonly<IRol>} – Rol público actualizado e inmutable.
 * @throws {NoEntryError} – Si no se encuentra el Rol.
 */
export const actualizarRol = async (
  nRol: number,
  rol: Partial<IRolInput>,
): Promise<Readonly<IRol>> => {
  const instancia = await Rol.findByPk(nRol);
  if (!instancia) throw new NoEntryError('Rol no encontrado');
  await instancia.update(rol);
  return instancia.toObj();
};

/**
 * Elimina un Rol.
 */
export const eliminarRol = async (nRol: number): Promise<void> => {
  const instancia = await Rol.findByPk(nRol);
  if (!instancia) throw new NoEntryError('Rol no encontrado');
  await instancia.destroy();
};

/**
 * Obtiene todos los Roles.
 */
export const obtenerTodosLosRoles = async (): Promise<Readonly<IRol>[]> => {
  const roles = await Rol.findAll();
  return roles.map((r) => r.toObj());
};
