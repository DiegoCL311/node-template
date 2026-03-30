import bcrypt from 'bcrypt';
import crypto from 'crypto';
import * as usuarioRepository from "../repositories/usuarioRepository";
import * as sesionRepository from "../repositories/sessionRepository";
import * as rolRepository from "../repositories/rolRepository";
import * as authUtils from '../utils/utils';
import { BadRequestError, AuthFailureError } from '../core/ApiError';
import { IUsuarioFull, IUsuario } from '../models/usuario';
import JWT from '../core/jwt';

/**
 * Lógica de negocio para registro de usuarios
 */
export const registerUser = async (data: any) => {
    const { cNombres, cUsuario, cPassword, nRol, cApellidos } = data;

    const usuarioEncotrado = await usuarioRepository.obtenerUsuarioFullByUsuario(cUsuario);
    if (usuarioEncotrado) throw new BadRequestError("Email ya registrado");

    const hashedPassword = await bcrypt.hash(cPassword, 10);

    return await usuarioRepository.crearUsuario({
        cNombres,
        cApellidos,
        cUsuario,
        cPassword: hashedPassword,
        nRol: nRol,
    });
};

/**
 * Lógica de negocio para inicio de sesión
 */
export const loginUser = async (cUsuario: string, cPassword: string) => {
    const usuario = await usuarioRepository.obtenerUsuarioFullByUsuario(cUsuario);

    if (!usuario) throw new AuthFailureError("Credenciales inválidas");
    if (usuario.nEstatus !== 1) throw new AuthFailureError("Usuario inactivo");

    if (!await bcrypt.compare(cPassword, usuario.cPassword)) {
        throw new AuthFailureError("Credenciales inválidas");
    }

    const accessKey = crypto.randomBytes(16).toString('hex');
    const refreshKey = crypto.randomBytes(16).toString('hex');

    const { accessToken, refreshToken } = await authUtils.createTokens(usuario, accessKey, refreshKey);

    await sesionRepository.crearSesion({
        nUsuario: usuario.nUsuario,
        accessKey,
        refreshKey,
        nEstatus: 1,
    });

    const rol = await rolRepository.obtenerRolByPk(usuario.nRol);

    return {
        accessToken,
        refreshToken,
        rol,
        usuario: {
            nUsuario: usuario.nUsuario,
            nRol: usuario.nRol,
            cNombres: usuario.cNombres,
            cApellidos: usuario.cApellidos,
            cUsuario: usuario.cUsuario,
        }
    };
};

/**
 * Lógica de negocio para cerrar sesión
 */
export const logoutUser = async (refreshToken: string) => {
    const payload = await JWT.validate(refreshToken);
    authUtils.validateTokenData(payload);
    // Aquí se podría invalidar la sesión en DB si fuera necesario
    // await sesionService.eliminarSesionByRefreshKey(payload.prm);
};

/**
 * Lógica de negocio para refrescar tokens
 */
export const refreshUserTokens = async (refreshToken: string) => {
    const payload = await JWT.validate(refreshToken);
    authUtils.validateTokenData(payload);

    const session = await sesionRepository.obtenerSesionByRefreshKey(payload.prm);
    if (!session) throw new AuthFailureError('Session not found');

    const user = await usuarioRepository.obtenerUsuarioFullById(Number(payload.sub));
    if (!user) throw new AuthFailureError('User not registered');

    const accessKey = crypto.randomBytes(16).toString('hex');
    
    // Actualizar sesión
    session.accessKey = accessKey;
    await sesionRepository.actualizarSesion(session.nSesion, session);

    const accessToken = await authUtils.createAccessToken(user, accessKey);
    const rol = await rolRepository.obtenerRolByPk(user.nRol);

    return {
        accessToken,
        rol,
        usuario: {
            nUsuario: user.nUsuario,
            cNombres: user.cNombres,
            cApellidos: user.cApellidos,
            cUsuario: user.cUsuario,
            nRol: user.nRol,
        }
    };
};
