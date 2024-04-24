import mysql, { PoolConnection } from "mysql2/promise";
import config from "../config";

let mysqlConnection: PoolConnection;

const mysqlLoader = async () => {
  const pool = mysql.createPool({
    host: config.database.mysql.host,
    user: config.database.mysql.user,
    password: config.database.mysql.password,
    database: config.database.mysql.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    port: Number(config.database.mysql.port),
  });

  mysqlConnection = await pool.getConnection();

  console.log("MySQL connected");
};

export { mysqlLoader, mysqlConnection };
