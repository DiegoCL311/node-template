import express from "express";
import auth from "./auth";
import authMiddleware from "../middlewares/authMiddleware";
import asyncErrorHandler from "../utils/asyncErrorHandler";

const app = express();

// Rutas no protegidas por middleware de autenticación
app.use("/auth", auth);

app.use(asyncErrorHandler(authMiddleware))

// Rutas protegidas por middleware de autenticación
export default app;
