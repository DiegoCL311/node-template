import { Request, Response, NextFunction } from "express";

function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day}-${month}-${year}:${hours}:${minutes}`;
}

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  const { method, originalUrl } = req;

  res.on("finish", () => {
    const responseTime = Date.now() - startTime;
    const { statusCode } = res;
    let statusColor: string;

    // Choose color based on status code
    switch (Math.floor(statusCode / 100)) {
      case 2:
        statusColor = "\x1b[32m"; // Green for 2xx codes
        break;
      case 3:
        statusColor = "\x1b[34m"; // Blue for 3xx codes
        break;
      case 4:
      case 5:
        statusColor = "\x1b[31m"; // Red for 4xx and 5xx codes
        break;
      default:
        statusColor = "\x1b[0m"; // Default color
    }

    console.log(
      `[${formatDate(
        new Date()
      )}] ${method} ${originalUrl} - ${statusColor}${statusCode}\x1b[0m (${responseTime}ms)`
    );
  });

  next();
}
