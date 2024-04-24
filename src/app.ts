import express from "express";
import loaders from "./loaders";
import dotenv from "dotenv";
import config from "./config";

dotenv.config();

async function startServer() {
  const app = express();

  await loaders.init({ expressApp: app });

  app.listen(3000, () => {
    console.log("Server is running on http://localhost:", config.port);
  });
}

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  console.error(err.stack?.split("\n")[1]);
});

process.on("unhandledRejection", (err: Error) => {
  console.error("Unhandled Rejection:", err.message);
  console.error(err.stack?.split("\n")[1]);
});

startServer();
