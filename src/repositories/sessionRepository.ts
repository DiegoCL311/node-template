import { NoEntryError } from '../core/ApiError';
import Sesion from '../database/models/sesion';
import { type ISesion, type ISesionFull, type ISesionInput } from '../models/sesion';

/**
 * Busca una Sesión por su clave primaria.
 * Usa `scope('full')` porque necesita `accessKey`/`refreshKey`.
 *
 * @param {number} nSesion – ID de la Sesión.
 * @returns {Readonly<ISesionFull> | null} – Sesión completa inmutable o null.
 */
export const obtenerSesionByPk = async (nSesion: number): Promise<Readonly<ISesionFull> | null> => {
  const sesion = await Sesion.scope('full').findByPk(nSesion);
  return sesion ? sesion.toObjFull() : null;
};

/**
 * Busca una Sesión por su `refreshKey`.
 * Usa `scope('full')` para obtener la clave completa.
 *
 * @param {string} refreshKey – Clave de refresco.
 * @returns {Readonly<ISesionFull> | null} – Sesión completa inmutable o null.
 */
export const obtenerSesionByRefreshKey = async (
  refreshKey: string,
): Promise<Readonly<ISesionFull> | null> => {
  const sesion = await Sesion.scope('full').findOne({ where: { refreshKey } });
  return sesion ? sesion.toObjFull() : null;
};

/**
 * Obtiene registro completo de una Sesión.
 * @param {number} id – ID de la Sesión a buscar.
 * @returns {Readonly<ISesionFull> | null} – Sesión completa inmutable o null.
 */
export const obtenerSesionFullById = async (id: number): Promise<Readonly<ISesionFull> | null> => {
  const sesion = await Sesion.scope('full').findByPk(id);
  return sesion ? sesion.toObjFull() : null;
};

/**
 * Crea una nueva Sesión.
 * @param {Omit<ISesionInput, 'nSesion'} sesion – Datos para crear la sesión.
 * @returns {Readonly<ISesionFull>} – Sesión completa inmutable.
 */
export const crearSesion = async (
  sesion: Omit<ISesionInput, 'nSesion'>,
): Promise<Readonly<ISesionFull>> => {
  const sesionInsertada = await Sesion.create(sesion as ISesionInput);
  return sesionInsertada.toObjFull();
};

/**
 * Actualiza campos de una Sesión existente.
 * @param {number} nSesion – ID de la Sesión a actualizar.
 * @param {Partial<ISesionInput>} sesion – Campos opcionales a modificar.
 * @returns {Readonly<ISesionFull>} – Sesión completa actualizada e inmutable.
 * @throws {NoEntryError} – Si no se encuentra la Sesión.
 */
export const actualizarSesion = async (
  nSesion: number,
  sesion: Partial<ISesionInput>,
): Promise<Readonly<ISesionFull>> => {
  const instancia = await Sesion.scope('full').findByPk(nSesion);
  if (!instancia) throw new NoEntryError('Sesión no encontrada');
  await instancia.update(sesion);
  return instancia.toObjFull();
};

/**
 * Rota el `accessKey` de una sesión (refresh-token flow).
 * Encapsula la mutación para que el servicio NUNCA toque la fila directamente.
 *
 * @param {number} nSesion – ID de la Sesión.
 * @param {string} accessKey – Nueva accessKey.
 * @returns {Readonly<ISesionFull>} – Sesión actualizada inmutable.
 * @throws {NoEntryError} – Si no se encuentra la Sesión.
 */
export const rotarAccessKey = async (
  nSesion: number,
  accessKey: string,
): Promise<Readonly<ISesionFull>> => {
  const instancia = await Sesion.scope('full').findByPk(nSesion);
  if (!instancia) throw new NoEntryError('Sesión no encontrada');
  await instancia.update({ accessKey });
  return instancia.toObjFull();
};

/**
 * Elimina una Sesión.
 */
export const eliminarSesion = async (nSesion: number): Promise<void> => {
  const instancia = await Sesion.scope('full').findByPk(nSesion);
  if (!instancia) throw new NoEntryError('Sesión no encontrada');
  await instancia.destroy();
};

/**
 * Obtiene todas las Sesiones.
 */
export const obtenerTodasLasSesiones = async (): Promise<Readonly<ISesion>[]> => {
  const sesiones = await Sesion.scope('full').findAll();
  return sesiones.map((s) => s.toObjFull());
};
