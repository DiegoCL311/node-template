import express from "express";
import { Express } from "express";
import routes from "../api/routes/index";
import cors from "cors";
import cookieParser from "cookie-parser";

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

  app.use("/api", routes);
};

export default expressLoader;
