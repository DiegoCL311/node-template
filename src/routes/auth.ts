import { Router } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import { validateRequest } from "../middlewares/validateRequest";
import authController from "../controllers/auth/auth";
import { usuarioSchema, loginSchema } from "../models/usuario"

const app = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully.
 */
app.post("/register", validateRequest(usuarioSchema), asyncErrorHandler(authController.register));

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful.
 */
app.post("/login", validateRequest(loginSchema), asyncErrorHandler(authController.login));

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     responses:
 *       200:
 *         description: Logout successful.
 */
app.post('/logout', asyncErrorHandler(authController.logout));

/**
 * @openapi
 * /auth/refresh-token:
 *   get:
 *     summary: Refresh access token
 *     responses:
 *       200:
 *         description: New access token generated.
 */
app.get('/refresh-token', asyncErrorHandler(authController.refreshToken));

export default app;