import express from "express";
import { Express } from "express";
import routes from "../routes/index";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "../middlewares/errorMiddleware";
import { requestLogger } from "../middlewares/requestLoggerMiddleware";
import { notFoundMiddleware } from "../middlewares/404Middleware";
import helmet from "helmet";
import asyncErrorHandler from "../../src/utils/asyncErrorHandler";
import authMiddleware from "../../src/middlewares/authMiddleware";

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


  app.use("/api", routes);


  app.use("*", notFoundMiddleware);
  app.use(asyncErrorHandler(authMiddleware))

  app.use(errorMiddleware);
};

export default expressLoader;
