import express from "express";
import testRoutes from "./test"
import authRoutes from "./auth";
import asyncErrorHandler from '../utils/asyncErrorHandler';
import authMiddleware from "../middlewares/authMiddleware";


const app = express();

// Rutas no protegidas por middleware de autenticación
app.use("/auth", authRoutes);

// Rutas protegidas por middleware de autenticación
app.get("/test", asyncErrorHandler(authMiddleware), testRoutes);

export default app;
