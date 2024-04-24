import winston from "winston";

let logger: winston.Logger;

const loggerLoader = async () => {
  logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: { service: "user" },
    transports: [
      new winston.transports.File({ filename: "error.log", level: "error" }),
      new winston.transports.File({ filename: "combined.log" }),
    ],
  });
};

export { loggerLoader, logger };
