import SesionService, { type ISesion } from '../models/sesion';
import { NoEntryError } from '../core/ApiError';

/**
 * Busca un Sesion por su clave primaria.
 * @param {number} nSesion – ID del Sesion.
 * @returns {ISesion | null} – Sesion o null.
 */
export const obtenerSesionByPk = async (nSesion: number): Promise<ISesion | null> => {
    const Sesion = await SesionService.findByPk(nSesion);
    return Sesion ? Sesion.toObj() : null;
};

/**
 * Busca un Sesion por su clave primaria.
 * @param {number} refreshKey – ID del Sesion.
 * @returns {ISesion | null} – Sesion o null.
 */
export const obtenerSesionByRefreshKey = async (refreshKey: string): Promise<ISesion | null> => {
    const Sesion = await SesionService.findOne({ where: { refreshKey: refreshKey } });
    return Sesion ? Sesion.toObj() : null;
};

/**
 * Obtiene registro completo de un Sesion.
 * @param {number} id – ID del Sesion a buscar.
 * @returns {ISesion | null} – Sesion completo (incluye  timestamps).
 */
export const obtenerSesionFullById = async (id: number): Promise<ISesion | null> => {
    const Sesion = await SesionService.findByPk(id);

    return Sesion ? Sesion.toObjFull() : null;
};

/**
 * Crea un nuevo Sesion.
 * @param {ISesion} Sesion – Datos para crear el Sesion.
 * @returns {ISesion} – Campos públicos del Sesion creado.
 */
export const crearSesion = async (Sesion: Omit<ISesion, 'nSesion'>): Promise<ISesion> => {
    const SesionInsertado = await SesionService.create(Sesion);
    return SesionInsertado.toObj();
};

/**
 * Actualiza campos de un Sesion existente.
 * @param {number} nSesion – ID del Sesion a actualizar.
 * @param {ISesion} Sesion – Campos opcionales a modificar.
 * @returns {ISesion} – Sesion público actualizado.
 * @throws {NoEntryError} – Si no se encuentra el Sesion.
 */
export const actualizarSesion = async (nSesion: number, Sesion: Partial<ISesion>): Promise<ISesion> => {
    const instancia = await SesionService.findByPk(nSesion);
    if (!instancia) throw new NoEntryError('Sesion no encontrado');
    await instancia.update(Sesion);
    return instancia.toObj();
};

