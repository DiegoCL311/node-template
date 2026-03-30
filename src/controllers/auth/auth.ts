import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { SuccessResponse, NoContentResponse } from '../../core/ApiResponse';
import { BadRequestError, AuthFailureError } from '../../core/ApiError';
import * as usuarioService from "../../services/usuarioService";
import * as rolServices from "../../services/rolService";
import * as sesionService from "../../services/sessionService";
import { createTokens, validateTokenData } from '../../utils/utils';
import { logger } from '../../loaders/logger';
import jwt from '../../core/jwt';
import crypto from 'crypto';
import * as authUtils from '../../utils/utils';


const register = async (req: Request, res: Response) => {
    const { cNombres, cUsuario, cPassword, nRol, cApellidos } = req.body;

    const usuarioEncotrado = await usuarioService.obtenerUsuarioFullByUsuario(cUsuario);

    if (usuarioEncotrado)
        throw new BadRequestError("Email ya registrado");

    const hashedPassword = await bcrypt.hash(cPassword, 10);

    const nuevoUsuario = await usuarioService.crearUsuario({
        cNombres,
        cApellidos,
        cUsuario,
        cPassword: hashedPassword,
        nRol: nRol,
    });

    new SuccessResponse("Registro exitoso", nuevoUsuario).send(res);
}

const login = async (req: Request, res: Response) => {
    const { cUsuario, cPassword } = req.body;
    logger.info(`Intento de login`, req.body);

    const usuario = await usuarioService.obtenerUsuarioFullByUsuario(cUsuario);

    logger.info(`Usuario encontrado`, usuario);

    if (!usuario)
        throw new AuthFailureError("Credenciales inválidas");

    //verificar si el usuario esta activo
    if (usuario.nEstatus !== 1)
        throw new AuthFailureError("Usuario inactivo");

    if (!await bcrypt.compare(cPassword, usuario.cPassword))
        throw new AuthFailureError("Credenciales inválidas");

    //access Tokens
    const accessKey = crypto.randomBytes(16).toString('hex');
    const refreshKey = crypto.randomBytes(16).toString('hex');

    const { accessToken, refreshToken } = await authUtils.createTokens(usuario, accessKey, refreshKey);

    //Crear la sesion
    await sesionService.crearSesion({
        nUsuario: usuario.nUsuario,
        accessKey: accessKey,
        refreshKey: refreshKey,
        nEstatus: 1,
    });

    const usuarioPublico = {
        nUsuario: usuario.nUsuario,
        nRol: usuario.nRol,
        cNombres: usuario.cNombres,
        cApellidos: usuario.cApellidos,
        cUsuario: usuario.cUsuario,
    }

    //Obtener el rol del usuario
    const rol = await rolServices.obtenerRolByPk(usuario.nRol);


    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    new SuccessResponse("Inicio de sesion exitoso", { usuario: usuarioPublico, rol, accessToken }).send(res)
}

const logout = async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return new NoContentResponse().send(res);

    const payload = await jwt.validate(refreshToken);

    validateTokenData(payload);

    //await deleteSessionByRefreshKey(payload.prm);

    //Clear cookie
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    });

    new NoContentResponse('Logout successful').send(res);
};

const refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) throw new AuthFailureError('Refresh token missing from cookie');

    const payload = await jwt.validate(refreshToken);
    validateTokenData(payload);

    //console.log(payload.prm);
    const session = await sesionService.obtenerSesionByRefreshKey(payload.prm);
    if (!session) throw new AuthFailureError('Session not found');

    const user = await usuarioService.obtenerUsuarioByPk(Number(payload.sub));
    if (!user) throw new AuthFailureError('User not registered');

    const accessKey = crypto.randomBytes(16).toString('hex');
    //update session
    session.accessKey = accessKey;
    await sesionService.actualizarSesion(session.nSesion, session);


    const accessToken = await authUtils.createAccessToken(user, accessKey);

    const usuarioPublico = {
        nUsuario: user.nUsuario,
        cNombres: user.cNombres,
        cApellidos: user.cApellidos,
        cUsuario: user.cUsuario,
        nRol: user.nRol,
    }

    //Obtener el rol del usuario
    const rol = await rolServices.obtenerRolByPk(user.nRol);

    new SuccessResponse('Access refreshed successfully', { usuario: usuarioPublico, rol, accessToken }).send(res);
}


export default {
    login,
    logout,
    register,
    refreshToken
}