import mssql from "mssql";
import { ConnectionPool } from "mssql";
import config from "../config";

let mssqlConnection: mssql.ConnectionPool;

const mssqlLoader = async () => {
  const pool = new ConnectionPool(config.database.mssql);
  await pool.connect();
  mssqlConnection = pool;

  console.log("MSSQL connected");
};

export { mssqlLoader, mssqlConnection };
