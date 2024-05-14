import express from "express";
import { Express } from "express";
import routes from "../routes";

import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "../middlewares/errorMiddleware";
import { requestLogger } from "../middlewares/requestLoggerMiddleware";
import { notFoundMiddleware } from "../middlewares/404Middleware";
import helmet from "helmet";

const expressLoader = async ({ app }: { app: Express }) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  app.use(cookieParser());
  app.use(requestLogger);
  app.use(helmet());

  //Rutas no protegidas por middleware de autenticación
  app.use("/api", routes);

  //Middleware para manejar rutas no encontradas
  app.use("*", notFoundMiddleware);

  app.use(errorMiddleware);
};

export default expressLoader;
