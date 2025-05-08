import { Router } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import { validateRequest } from "../middlewares/validateRequest";
import authController from "../controllers/auth/auth";
import { usuarioSchema, loginSchema } from "../models/usuario"

const app = Router();

app.post("/register", validateRequest(usuarioSchema), asyncErrorHandler(authController.register));

app.post("/login", validateRequest(loginSchema), asyncErrorHandler(authController.login));

app.post('/logout', asyncErrorHandler(authController.logout));

app.get('/refresh-token', asyncErrorHandler(authController.refreshToken));

export default app;