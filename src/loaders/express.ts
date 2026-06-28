import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express, Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import { corsOrigin } from '../config';
import { BODY_SIZE_LIMIT, RATE_LIMIT } from '../constants';
import routes from '../controllers';
import { notFoundMiddleware } from '../middlewares/404Middleware';
import { errorMiddleware } from '../middlewares/errorMiddleware';
import { requestLogger } from '../middlewares/requestLoggerMiddleware';
import { sanitizerMiddleware } from '../middlewares/sanitizerMiddleware';

const expressLoader = async ({ app }: { app: Express }) => {
  app.use(express.json({ limit: BODY_SIZE_LIMIT }));
  app.use(express.urlencoded({ limit: BODY_SIZE_LIMIT, extended: true }));

  app.use(helmet());

  app.use(
    cors({
      origin: corsOrigin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
    }),
  );

  app.use(
    '/auth',
    rateLimit({
      windowMs: RATE_LIMIT.auth.windowMs,
      max: RATE_LIMIT.auth.max,
      message: RATE_LIMIT.auth.message,
    }),
  );

  app.use(
    rateLimit({
      windowMs: RATE_LIMIT.global.windowMs,
      max: RATE_LIMIT.global.max,
      message: RATE_LIMIT.global.message,
    }),
  );

  app.use(compression());
  app.use(cookieParser());
  app.use(requestLogger);
  app.use(sanitizerMiddleware);

  app.use('/api/v1', routes);

  app.use((req: Request, res: Response, next: NextFunction) => notFoundMiddleware(req, res, next));

  app.use(errorMiddleware);
};

export default expressLoader;
