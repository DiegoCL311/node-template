import Usuario, { IUsuario, IDataUsuario, IUsuarioFull } from '../models/usuario';
import { NoEntryError } from '../core/ApiError';


/**
 * Obtiene registro completo de un usuario.
 * @param {string} cUsuario – Usuario a buscar.
 * @returns {IUsuarioFull | null} – Usuario completo (incluye password y timestamps).
 */
export const obtenerUsuarioFullByUsuario = async (cUsuario: string): Promise<IUsuarioFull | null> => {
    const usuario = await Usuario.findOne({ where: { cUsuario } });

    return usuario ? usuario.toUsuarioFull() : null;
};

/**
 * Busca un usuario por su clave primaria.
 * @param {number} id – ID del usuario.
 * @returns {IUsuario | null} – Usuario público o null.
 */
export const obtenerUsuarioByPk = async (id: number): Promise<IUsuario | null> => {
    const usuario = await Usuario.findByPk(id);
    return usuario ? usuario.toUsuario() : null;
};

/**
 * Obtiene registro completo de un usuario.
 * @param {number} id – ID del usuario a buscar.
 * @returns {IUsuarioFull | null} – Usuario completo (incluye password y timestamps).
 */
export const obtenerUsuarioFullById = async (id: number): Promise<IUsuarioFull | null> => {
    const usuario = await Usuario.findByPk(id);

    return usuario ? usuario.toUsuarioFull() : null;
};

/**
 * Crea un nuevo usuario.
 * @param {IUsuarioInsert} usuario – Datos para crear el usuario.
 * @returns {IUsuario} – Campos públicos del usuario creado.
 */
export const crearUsuario = async (usuario: IDataUsuario): Promise<IUsuario> => {
    const usuarioInsertado = await Usuario.create(usuario);
    return usuarioInsertado.toUsuario();
};

/**
 * Actualiza campos de un usuario existente.
 * @param {IUsuarioUpdate} usuario – nUsuario y campos opcionales a modificar.
 * @returns {IUsuario} – Usuario público actualizado.
 * @throws {NoEntryError} – Si no se encuentra el usuario.
 */
export const actualizarUsuario = async (nUsuario: number, usuario: Partial<IDataUsuario>): Promise<IUsuario> => {
    const instancia = await Usuario.findByPk(nUsuario);
    if (!instancia) throw new NoEntryError('Usuario no encontrado');
    await instancia.update(usuario);
    return instancia.toUsuario();
};

