import { Request, Response, NextFunction } from "express";

function sanitize(obj: any): any {
  if (typeof obj !== "object" || obj === null) return obj;

  for (const key in obj) {
    if (typeof obj[key] === "string") {
      // Basic HTML filtering (manual) or you can use a library
      // For a template, we'll do a simple scrub
      obj[key] = obj[key].replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "").trim();
    } else if (typeof obj[key] === "object") {
      sanitize(obj[key]);
    }
  }
}

export const sanitizerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);
  next();
};
