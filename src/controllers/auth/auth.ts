import { Request, Response } from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import { BadRequestError } from '../../core/ApiError';
import Usuario from '../../models/user';
import bcrypt from 'bcrypt';
import crypto from 'crypto-js';
import JWT from '../../core/jwt';
import { createTokens } from '../../utils/utils';

const register = async (req: Request, res: Response) => {
    const { nombre, email, contrasena } = req.body;

    const foundUser = await Usuario.findOne({ where: { email } });

    if (foundUser)
        throw new BadRequestError("Email already exists");

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const user = await Usuario.create({
        id: 0,
        nombre,
        contrasena: hashedPassword,
        email,
    }, { raw: true });


    new SuccessResponse(res, "register Success", user)
}

const login = async (req: Request, res: Response) => {
    const { email, contrasena } = req.body;

    const user = await Usuario.findOne({ where: { email } }).then((user) => user?.toJSON());

    if (!user?.contrasena)
        throw new BadRequestError("Invalid Credentials");

    if (!await bcrypt.compare(contrasena, user.contrasena))
        throw new BadRequestError("Invalid Credentials");

    //tokens
    const { accessToken, refreshToken } = await createTokens(user);

    delete user.contrasena;

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    new SuccessResponse(res, "login Success", { user: user, accessToken: accessToken })
}

export default {
    login,
    register
}