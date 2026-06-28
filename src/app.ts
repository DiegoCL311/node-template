import express, { Express } from 'express';

import { port } from './config';
import loaders from './loaders';
import { logger } from './loaders/logger';

const app: Express = express();

export async function startServer(app: Express) {
  await loaders.init({ expressApp: app });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
if (process.env.NODE_ENV !== 'test') startServer(app);

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err);
  process.exit(1);
});

export default app;
