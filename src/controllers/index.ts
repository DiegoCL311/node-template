import express from "express";
import authRoutes from "./auth";
import statusRoutes from "./status";

const app = express();

// Rutas no protegidas por middleware de autenticación
app.use("/status", statusRoutes);
app.use("/auth", authRoutes);


export default app;
