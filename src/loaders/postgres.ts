import postgres, { Sql } from "postgres";
import config from "../config";

let postgresConnection: Sql;

const postgresLoader = async () => {
  const sql = postgres(`postgresql://${config.database.user}:${config.database.password}@${config.database.host}:${config.database.port}/${config.database.database}`, {
    host: config.database.host,
    port: Number(config.database.port),
    database: config.database.database,
    username: config.database.user,
    password: config.database.password,
  });

  postgresConnection = sql;
};

export { postgresLoader, postgresConnection };
