import mssql from "mssql";
import { ConnectionPool } from "mssql";
import config from "../config";

let mssqlConnection: mssql.ConnectionPool;

const mssqlLoader = async () => {
  const pool = new ConnectionPool({
    user: config.database.mssql.user,
    password: config.database.mssql.password,
    server: config.database.mssql.server,
    database: config.database.mssql.database,
    options: {
      encrypt: true,
      enableArithAbort: true,
      trustServerCertificate: true,
    },
  });

  await pool.connect();
  mssqlConnection = pool;

  console.log("MSSQL connected");
};

export { mssqlLoader, mssqlConnection };
