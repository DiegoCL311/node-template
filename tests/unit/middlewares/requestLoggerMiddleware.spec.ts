import { Request, Response } from 'express';

type LoggerMock = {
  info: jest.Mock;
  warn: jest.Mock;
  error: jest.Mock;
  debug: jest.Mock;
};

type MockRes = Response & {
  _triggerFinish: (statusCode?: number) => void;
};

const setupTest = (env: 'development' | 'production' | 'test') => {
  jest.resetModules();
  jest.doMock('../../../src/config', () => ({
    environment: env,
    port: 3000,
    corsOrigin: 'http://localhost:5173',
    database: {},
    jwt: {},
  }));
  jest.doMock('../../../src/loaders/logger', () => ({
    logger: {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    },
  }));

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const loggerModule = require('../../../src/loaders/logger');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const middlewareModule = require('../../../src/middlewares/requestLoggerMiddleware');
  return {
    requestLogger: middlewareModule.requestLogger as (
      req: Request,
      res: Response,
      next: jest.Mock,
    ) => void,
    logger: loggerModule.logger as LoggerMock,
  };
};

const buildRes = (): MockRes => {
  const finishHandlers: Array<() => void> = [];
  const res: any = {
    headersSent: false,
    locals: {},
    statusCode: 200,
    setHeader: jest.fn(),
    getHeader: jest.fn(),
    on: jest.fn((event: string, handler: () => void) => {
      if (event === 'finish') finishHandlers.push(handler);
      return res;
    }),
    write: jest.fn(),
    end: jest.fn(),
  };

  res._triggerFinish = (statusCode = 200) => {
    res.statusCode = statusCode;
    finishHandlers.forEach((h) => h());
  };

  return res;
};

const buildReq = (overrides: Partial<Request> = {}): Request =>
  ({
    headers: {},
    body: {},
    method: 'GET',
    originalUrl: '/test',
    ip: '127.0.0.1',
    ...overrides,
  }) as Request;

describe('requestLogger (development mode)', () => {
  let logger: LoggerMock;
  let requestLogger: (req: Request, res: Response, next: jest.Mock) => void;

  beforeEach(() => {
    const ctx = setupTest('development');
    logger = ctx.logger;
    requestLogger = ctx.requestLogger;
  });

  it('preserves x-request-id from the incoming request and echoes it on the response', () => {
    const req = buildReq({ headers: { 'x-request-id': 'incoming-corr-id' } });
    const res = buildRes();
    const next = jest.fn();

    requestLogger(req, res, next);

    expect(req.headers['x-request-id']).toBe('incoming-corr-id');
    expect(res.setHeader).toHaveBeenCalledWith('x-request-id', 'incoming-corr-id');
  });

  it('generates a correlation id when none is provided', () => {
    const req = buildReq();
    const res = buildRes();
    const next = jest.fn();

    requestLogger(req, res, next);

    const rid = req.headers['x-request-id'] as string;
    expect(typeof rid).toBe('string');
    expect(rid.length).toBeGreaterThan(0);
    expect(res.setHeader).toHaveBeenCalledWith('x-request-id', rid);
  });

  it('calls next() to continue the middleware chain', () => {
    const req = buildReq();
    const res = buildRes();
    const next = jest.fn();

    requestLogger(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('logs a separator line containing method and URL when the response finishes', () => {
    const req = buildReq({ method: 'POST', originalUrl: '/api/users' });
    const res = buildRes();

    requestLogger(req, res, jest.fn());
    res._triggerFinish(201);

    const messages = logger.info.mock.calls.map((c) => String(c[0]));
    const separator = messages.find((m) => m.startsWith('-'));
    expect(separator).toBeDefined();
    expect(separator).toContain('POST');
    expect(separator).toContain('/api/users');
  });

  it('logs the request body in development mode', () => {
    const req = buildReq({ body: { name: 'Alice', email: 'a@b.c' } });
    const res = buildRes();

    requestLogger(req, res, jest.fn());
    res._triggerFinish(200);

    const allCalls = JSON.stringify(logger.info.mock.calls);
    expect(allCalls).toContain('Alice');
  });

  it('captures and logs the response body in development mode', () => {
    const req = buildReq({ method: 'GET', originalUrl: '/api/items' });
    const res = buildRes();

    requestLogger(req, res, jest.fn());

    res.end('{"id":42,"name":"Item"}');

    res._triggerFinish(200);

    const allCalls = JSON.stringify(logger.info.mock.calls);
    expect(allCalls).toContain('Item');
  });

  it('logs status code and response time', () => {
    const req = buildReq();
    const res = buildRes();

    requestLogger(req, res, jest.fn());
    res._triggerFinish(200);

    const allCalls = JSON.stringify(logger.info.mock.calls);
    expect(allCalls).toContain('200');
    expect(allCalls).toMatch(/ms/);
  });
});

describe('requestLogger (production mode)', () => {
  let logger: LoggerMock;
  let requestLogger: (req: Request, res: Response, next: jest.Mock) => void;

  beforeEach(() => {
    const ctx = setupTest('production');
    logger = ctx.logger;
    requestLogger = ctx.requestLogger;
  });

  it('does NOT log request body in production mode', () => {
    const req = buildReq({ body: { password: 'supersecret' } });
    const res = buildRes();

    requestLogger(req, res, jest.fn());
    res._triggerFinish(200);

    const allCalls = JSON.stringify(logger.info.mock.calls);
    expect(allCalls).not.toContain('supersecret');
  });

  it('does NOT capture response body in production mode', () => {
    const req = buildReq();
    const res = buildRes();

    requestLogger(req, res, jest.fn());

    expect(res.end).not.toHaveBeenCalled();
    res.end('{"secret":"response-data"}');
    expect(res.end).toHaveBeenCalled();

    res._triggerFinish(200);

    const allCalls = JSON.stringify(logger.info.mock.calls);
    expect(allCalls).not.toContain('response-data');
  });

  it('still logs the separator in production mode', () => {
    const req = buildReq({ method: 'GET', originalUrl: '/api/health' });
    const res = buildRes();

    requestLogger(req, res, jest.fn());
    res._triggerFinish(200);

    const messages = logger.info.mock.calls.map((c) => String(c[0]));
    const separator = messages.find((m) => m.startsWith('-'));
    expect(separator).toBeDefined();
    expect(separator).toContain('GET');
    expect(separator).toContain('/api/health');
  });
});
