import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { port } from "../config";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Node Template API",
      version: "1.0.0",
      description: "API documentation for the Node.js template",
    },
    servers: [
      {
        url: `http://localhost:${port}/api/v1`,
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/models/*.ts"], // Correct paths to your routes
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerLoader = async ({ app }: { app: Express }) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default swaggerLoader;
