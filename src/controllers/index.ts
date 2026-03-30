import express from "express";
import authRoutes from "./auth";
import statusRoutes from "./status";
import catalogoRoutes from "./catalogo";

const app = express();

// Rutas no protegidas por middleware de autenticación
app.use("/status", statusRoutes);
app.use("/auth", authRoutes);
app.use("/catalogos", catalogoRoutes);


export default app;
