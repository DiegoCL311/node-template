import { Router, Request, Response } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import { validateRequest } from "../middlewares/validateRequest";
import { usuarioSchema, loginSchema } from "../models/usuario";
import * as authService from "../services/authService";
import { SuccessResponse, NoContentResponse } from "../core/ApiResponse";
import { AuthFailureError } from "../core/ApiError";

const app = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: User registered successfully.
 */
app.post("/register", validateRequest(usuarioSchema), asyncErrorHandler(async (req: Request, res: Response) => {
    const nuevoUsuario = await authService.registerUser(req.body);
    new SuccessResponse("Registro exitoso", nuevoUsuario).send(res);
}));

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login successful.
 */
app.post("/login", validateRequest(loginSchema), asyncErrorHandler(async (req: Request, res: Response) => {
    const { cUsuario, cPassword } = req.body;
    const { accessToken, refreshToken, usuario, rol } = await authService.loginUser(cUsuario, cPassword);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    new SuccessResponse("Inicio de sesion exitoso", { usuario, rol, accessToken }).send(res);
}));

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful.
 */
app.post('/logout', asyncErrorHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
        await authService.logoutUser(refreshToken);
    }
    
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    });

    new NoContentResponse('Logout successful').send(res);
}));

/**
 * @openapi
 * /auth/refresh-token:
 *   get:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: New access token generated.
 */
app.get('/refresh-token', asyncErrorHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) throw new AuthFailureError('Refresh token missing from cookie');

    const { accessToken, usuario, rol } = await authService.refreshUserTokens(refreshToken);

    new SuccessResponse('Access refreshed successfully', { usuario, rol, accessToken }).send(res);
}));

export default app;