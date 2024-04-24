import postgres, { Sql } from "postgres";
import config from "../config";

let postgresConnection: Sql;

const postgresLoader = async () => {
  const sql = postgres(config.database.postgres.uri, {
    host: config.database.postgres.host,
    port: Number(config.database.postgres.port),
    database: config.database.postgres.database,
    username: config.database.postgres.user,
    password: config.database.postgres.password,
  });

  postgresConnection = sql;
};

export { postgresLoader, postgresConnection };
