import winston from "winston";

let logger: winston.Logger;

const loggerLoader = async () => {

  const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {

      let log = `${timestamp} [${level}]: ${message}`;

      if (Object.keys(meta).length) {
        log += `\n${JSON.stringify(meta, null, 2)}`;
      }

      if (stack) {
        log += `\n${stack}`;
      }

      return log;
    })
  );

  const fileFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
      return JSON.stringify({
        timestamp: timestamp,
        level: level,
        message: message,
        ...meta,
        stack: stack || null
      });
    })
  );

  logger = winston.createLogger({
    level: "debug",
    transports: [

      new winston.transports.File({
        filename: "logs/error.log",
        level: "error",
        format: fileFormat
      }),

      new winston.transports.File({
        filename: "logs/combined.log",
        format: fileFormat
      }),

      new winston.transports.Console({
        format: consoleFormat
      })
    ]
  });
};

process.on("unhandledRejection", (err: Error) => {
  logger.error("Unhandled Rejection", { message: err.message, stack: err.stack });

  console.error("Unhandled Rejection:", err.message);
  console.error(err.stack?.split("\n")[1]);
});

export { loggerLoader, logger };