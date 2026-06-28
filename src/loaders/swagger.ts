import { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { port } from '../config';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node Template API',
      version: '1.0.0',
      description: 'API documentation for the Node.js template',
    },
    servers: [
      {
        url: `http://localhost:${port}/api/v1`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Catalogo: {
          type: 'object',
          properties: {
            nIdCatalogo: { type: 'integer' },
            cClave: { type: 'string' },
            cDescripcion: { type: 'string' },
            bActivo: { type: 'boolean' },
          },
        },
        CatalogoValor: {
          type: 'object',
          properties: {
            nIdCatalogoValor: { type: 'integer' },
            nIdCatalogo: { type: 'integer' },
            nOrden: { type: 'integer' },
            cClave: { type: 'string' },
            cValor: { type: 'string' },
            cValorExtra: { type: 'string' },
            bActivo: { type: 'boolean' },
          },
        },
        Usuario: {
          type: 'object',
          required: ['nRol', 'cNombres', 'cApellidos', 'cUsuario', 'cPassword'],
          properties: {
            nRol: { type: 'integer', example: 1 },
            cNombres: { type: 'string', example: 'Juan' },
            cApellidos: { type: 'string', example: 'Pérez' },
            cUsuario: { type: 'string', example: 'jperez' },
            cPassword: { type: 'string', example: 'secreto123' },
          },
        },
        Login: {
          type: 'object',
          required: ['cUsuario', 'cPassword'],
          properties: {
            cUsuario: { type: 'string', example: 'jperez' },
            cPassword: { type: 'string', example: 'secreto123' },
          },
        },
      },
    },
  },
  apis: ['./src/controllers/*.ts', './src/models/*.ts'], // Updated to src/controllers
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerLoader = async ({ app }: { app: Express }) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default swaggerLoader;
