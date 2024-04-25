import winston from "winston";

let logger: winston.Logger;

const loggerLoader = async () => {
  logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: { service: "user" },
    transports: [
      new winston.transports.File({ filename: "error.log", level: "error" }),
    ],
  });
};

process.on("unhandledRejection", (err: Error) => {
  logger.error(
    "Uncaught Exception " + err.message + " at " + err.stack?.split("\n")[0]
  );

  console.error("Unhandled Rejection:", err.message);
  console.error(err.stack?.split("\n")[1]);
});

export { loggerLoader, logger };
