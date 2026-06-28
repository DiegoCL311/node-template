import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';

import { environment } from '../config';
import { logger } from '../loaders/logger';

const SEPARATOR_WIDTH = 80;
const SEPARATOR_CHAR = '-';

function buildSeparator(text: string): string {
  const innerPadding = 2;
  const totalInner = text.length + innerPadding;
  const padTotal = Math.max(0, SEPARATOR_WIDTH - totalInner);
  const left = Math.floor(padTotal / 2);
  const right = padTotal - left;
  return SEPARATOR_CHAR.repeat(left) + ' ' + text + ' ' + SEPARATOR_CHAR.repeat(right);
}

function captureResponseBody(res: Response): void {
  const chunks: Buffer[] = [];
  const originalWrite = res.write.bind(res);
  const originalEnd = res.end.bind(res);

  (res as any).write = function (chunk: unknown, ...args: unknown[]): boolean {
    if (chunk) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
    }
    return (originalWrite as (...a: unknown[]) => boolean)(chunk, ...args);
  };

  (res as any).end = function (chunk?: unknown, ...args: unknown[]): Response {
    if (chunk) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
    }
    res.locals = res.locals ?? {};
    res.locals.capturedBody = Buffer.concat(chunks).toString('utf8');
    return (originalEnd as (...a: unknown[]) => Response)(chunk, ...args);
  };
}

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();
  const { method, originalUrl } = req;

  const correlationId = (req.headers['x-request-id'] as string) || randomUUID();
  req.headers['x-request-id'] = correlationId;
  res.setHeader('x-request-id', correlationId);

  const isDev = environment === 'development';

  if (isDev) {
    captureResponseBody(res);
  }

  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    const { statusCode } = res;
    const ridShort = correlationId.substring(0, 8);

    if (isDev) {
      const separator = buildSeparator(`${method} ${originalUrl} | RID: ${ridShort}`);
      const reqBody =
        req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0
          ? req.body
          : null;
      const resBody = res.locals?.capturedBody ?? null;

      logger.info(separator);
      if (reqBody !== null) {
        logger.info('Request Body', { body: reqBody });
      }
      if (resBody) {
        logger.info('Response Body', { body: resBody });
      }
      logger.info(`→ ${statusCode} (${responseTime}ms)`);
    } else {
      const separator = buildSeparator(
        `${method} ${originalUrl} → ${statusCode} (${responseTime}ms) | RID: ${ridShort}`,
      );
      logger.info(separator);
    }
  });

  next();
}
