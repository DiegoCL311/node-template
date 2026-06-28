import mssql, { ConnectionPool } from 'mssql';

import config from '../config';

let mssqlConnection: mssql.ConnectionPool;

const mssqlLoader = async () => {
  const pool = new ConnectionPool({
    user: config.database.user,
    password: config.database.password,
    server: config.database.host,
    database: config.database.database,
    options: {
      encrypt: true,
      enableArithAbort: true,
      trustServerCertificate: true,
    },
  });

  await pool.connect();
  mssqlConnection = pool;

  console.log('MSSQL connected');
};

export { mssqlLoader, mssqlConnection };
