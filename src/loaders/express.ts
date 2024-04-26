import express from "express";
import { Express } from "express";
import routes from "../routes/index";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "../middlewares/errorMiddleware";
import { requestLogger } from "../middlewares/requestLoggerMiddleware";
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

  app.use("/api", routes);
  app.use(errorMiddleware);
};

export default expressLoader;
