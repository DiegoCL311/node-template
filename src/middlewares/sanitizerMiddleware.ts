import { Request, Response, NextFunction } from 'express';
import { xss } from 'express-xss-sanitizer';

export const sanitizerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  xss()(req, res, next);
};

export default sanitizerMiddleware;
