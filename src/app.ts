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

startServer();
