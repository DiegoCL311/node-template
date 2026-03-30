import RolService, { IRol } from '../models/roles';
import { NoEntryError } from '../core/ApiError';

/**
 * Busca un Rol por su clave primaria.
 * @param {number} nRol – ID del Rol.
 * @returns {IRol | null} – Rol o null.
 */
export const obtenerRolByPk = async (nRol: number): Promise<IRol | null> => {
    const rol = await RolService.findByPk(nRol);
    return rol ? rol.toObj() : null;
};

/**
 * Obtiene registro completo de un Rol.
 * @param {number} id – ID del Rol a buscar.
 * @returns {IRol | null} – Rol completo (incluye  timestamps).
 */
export const obtenerRolFullById = async (id: number): Promise<IRol | null> => {
    const Rol = await RolService.findByPk(id);

    return Rol ? Rol.toObjFull() : null;
};

/**
 * Crea un nuevo Rol.
 * @param {IRolInsert} Rol – Datos para crear el Rol.
 * @returns {IRol} – Campos públicos del Rol creado.
 */
export const crearRol = async (Rol: IRol): Promise<IRol> => {
    const RolInsertado = await RolService.create(Rol);
    return RolInsertado.toObj();
};

/**
 * Actualiza campos de un Rol existente.
 * @param {IRolUpdate} Rol – nRol y campos opcionales a modificar.
 * @returns {IRol} – Rol público actualizado.
 * @throws {NoEntryError} – Si no se encuentra el Rol.
 */
export const actualizarRol = async (nRol: number, Rol: Partial<IRol>): Promise<IRol> => {
    const instancia = await RolService.findByPk(nRol);
    if (!instancia) throw new NoEntryError('Rol no encontrado');
    await instancia.update(Rol);
    return instancia.toObj();
};

