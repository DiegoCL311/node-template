import Usuario, { IUsuario } from '../models/usuario';
import { NoEntryError } from "../core/ApiError"

export const encontrarUsuarioByEmail = async (email: string): Promise<IUsuario | null> => {
    const usuario = await Usuario.findOne({ where: { email } });
    return usuario ? usuario.toJSON() : null;
}

export const crearUsuario = async (nombre: string, email: string, contrasena: string): Promise<IUsuario> => {
    const usuario = await Usuario.create({ nombre, email, contrasena });
    return usuario.toJSON() as IUsuario;
}

export const encontrarUsuarioByPk = async (id: number): Promise<IUsuario | null> => {
    const usuario = await Usuario.findByPk(id, { attributes: { exclude: ['contrasena'] } });
    return usuario ? usuario.toJSON() : null;
}

export const actualizarUsuario = async (id: number, nombre: string, email: string): Promise<IUsuario> => {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) throw new NoEntryError("Usuario no encontrado");
    await usuario.update({ nombre, email });
    return usuario.toJSON();
}