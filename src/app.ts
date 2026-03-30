import express, { Express } from "express";
import loaders from "./loaders";
import dotenv from "dotenv";
import { port } from "./config";
import { logger } from "./loaders/logger";

dotenv.config();
let app: Express = express();

export async function startServer(app: Express) {

  await loaders.init({ expressApp: app });

  const server = app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`);
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    logger.info("SIGTERM signal received: closing HTTP server");
    server.close(() => {
      logger.info("HTTP server closed");
      process.exit(0);
    });
  });

  process.on("SIGINT", () => {
    logger.info("SIGINT signal received: closing HTTP server");
    server.close(() => {
      logger.info("HTTP server closed");
      process.exit(0);
    });
  });

}
if (process.env.NODE_ENV !== "test")
  startServer(app);

export default app;