import winston from "winston";

let logger: winston.Logger;

const loggerLoader = async () => {
  const transports: winston.transport[] = [
    new winston.transports.File({ filename: "error.log", level: "error" }),
  ];

  if (process.env.NODE_ENV === "development") {
    transports.push(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      })
    );
  }

  logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: { service: "user" },
    transports: transports,
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
