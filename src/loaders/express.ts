import express, { Express } from "express";
import compression from "compression";
import rateLimit from "express-rate-limit";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import routes from "../routes";
import { corsOrigin } from "../config";
import { errorMiddleware } from "../middlewares/errorMiddleware";
import { requestLogger } from "../middlewares/requestLoggerMiddleware";
import { notFoundMiddleware } from "../middlewares/404Middleware";
import { sanitizerMiddleware } from "../middlewares/sanitizerMiddleware";


const expressLoader = async ({ app }: { app: Express }) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Security and Performance
  app.use(compression());
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Demasiadas peticiones desde esta IP, por favor intenta después de 15 minutos",
  }));

  app.use(
    cors({
      origin: corsOrigin,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization", "x-request-id"],
    })
  );
  app.use(cookieParser());
  app.use(requestLogger);
  app.use(helmet());
  app.use(sanitizerMiddleware);

  // Rutas de la aplicación (Versionamiento v1)
  app.use("/api/v1", routes);

  // Middleware para manejar rutas no encontradas
  app.use("*", notFoundMiddleware);

  // Middleware para manejar errores
  app.use(errorMiddleware);
};

export default expressLoader;
