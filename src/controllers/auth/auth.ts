import { Request, Response } from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import { BadRequestError } from '../../core/ApiError';
import * as usuarioService from "../../services/usuarioService";
import bcrypt from 'bcrypt';
import { createTokens } from '../../utils/utils';

const register = async (req: Request, res: Response) => {
    const { nombre, email, contrasena } = req.body;

    const usuarioEncotrado = await usuarioService.encontrarUsuarioByEmail(email);

    if (usuarioEncotrado)
        throw new BadRequestError("Email ya registrado");

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const usuario = await usuarioService.crearUsuario(nombre, email, hashedPassword);

    new SuccessResponse(res, "Registro exitoso", usuario)
}

const login = async (req: Request, res: Response) => {
    const { email, contrasena } = req.body;

    const usuario = await usuarioService.encontrarUsuarioByEmail(email);

    if (!usuario?.contrasena)
        throw new BadRequestError("Credenciales inválidas");

    if (!await bcrypt.compare(contrasena, usuario.contrasena))
        throw new BadRequestError("Credenciales inválidas");

    //tokens
    const { accessToken, refreshToken } = await createTokens(usuario);

    delete usuario.contrasena;

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    new SuccessResponse(res, "Inicio de sesion exitoso", { usuario: usuario, accessToken: accessToken })
}

export default {
    login,
    register
}