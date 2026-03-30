import express, { Express } from "express";
import loaders from "./loaders";
import dotenv from "dotenv";
import { port } from "./config";
import { logger } from "./loaders/logger";

dotenv.config();
let app: Express = express();

export async function startServer(app: Express) {

  await loaders.init({ expressApp: app });

  app.listen(3000, () => {
    console.log("Server is running on http://localhost:", port);
  });

}
if (process.env.NODE_ENV !== "test")
  startServer(app);

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
  logger.error("UNHANDLED REJECTION! 💥 Shutting down...");
  logger.error(err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  logger.error(err);
  process.exit(1);
});

export default app;