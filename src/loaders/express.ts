import express from "express";
import { Express } from "express";
import routes from "../routes";

import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { errorMiddleware } from "../middlewares/errorMiddleware";
import { requestLogger } from "../middlewares/requestLoggerMiddleware";
import { notFoundMiddleware } from "../middlewares/404Middleware";

const expressLoader = async ({ app }: { app: Express }) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization",],
    })
  );
  app.use(cookieParser());
  app.use(requestLogger);
  app.use(helmet());

  //Rutas de la applicación
  app.use("/api", routes);

  //Middleware para manejar rutas no encontradas
  app.use("*", notFoundMiddleware);

  //Middleware para manejar errores
  app.use(errorMiddleware);
};

export default expressLoader;
