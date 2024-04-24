import mssql from "mssql";
import { ConnectionPool } from "mssql";
import config from "../config";

let mssqlConnection: mssql.ConnectionPool;

const mssqlLoader = async () => {
  const pool = new ConnectionPool({
    server: config.database.mssql.server,
    user: config.database.mssql.user,
    password: config.database.mssql.password,
    database: config.database.mssql.database,
  });
  await pool.connect();
  mssqlConnection = pool;

  console.log("MSSQL connected");
};

export { mssqlLoader, mssqlConnection };
