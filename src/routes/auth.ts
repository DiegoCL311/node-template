import { Router, Request, Response, NextFunction } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import { validateRequest } from "../middlewares/validateRequest";
import authController from "../controllers/auth/auth";
import { registerSchema, loginSchema } from "../models/usuario"

const app = Router();

app.post("/register", validateRequest(registerSchema), asyncErrorHandler(authController.register));

app.post("/login", validateRequest(loginSchema), asyncErrorHandler(authController.login));

export default app;