import { Request, Response, NextFunction } from "express";
import { randomUUID } from "node:crypto";

function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${day}-${month}-${year}:${hours}:${minutes}:${seconds}`;
}

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  const { method, originalUrl } = req;

  // Generate or get Correlation ID
  const correlationId = (req.headers["x-request-id"] as string) || randomUUID();
  req.headers["x-request-id"] = correlationId;
  res.setHeader("x-request-id", correlationId);

  res.on("finish", () => {
    const responseTime = Date.now() - startTime;
    const { statusCode } = res;
    let statusColor: string;

    switch (Math.floor(statusCode / 100)) {
      case 2:
        statusColor = "\x1b[32m";
        break;
      case 3:
        statusColor = "\x1b[34m";
        break;
      case 4:
      case 5:
        statusColor = "\x1b[31m";
        break;
      default:
        statusColor = "\x1b[0m";
    }

    console.log(
      `[${formatDate(
        new Date()
      )}] [RID: ${correlationId.substring(0, 8)}] ${method} ${originalUrl} - ${statusColor}${statusCode}\x1b[0m (${responseTime}ms)`
    );
  });

  next();
}
