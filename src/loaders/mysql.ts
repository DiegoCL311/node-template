import mysql, { PoolConnection, RowDataPacket } from "mysql2/promise";
import config from "../config";

let mysqlConnectionPool: mysql.Pool;

const mysqlLoader = async () => {
  mysqlConnectionPool = mysql.createPool({
    host: config.database.mysql.host,
    user: config.database.mysql.user,
    password: config.database.mysql.password,
    database: config.database.mysql.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    port: Number(config.database.mysql.port),
  });


  console.log("MySQL connected");
};


async function getConnection(): Promise<PoolConnection> {
  return await mysqlConnectionPool.getConnection();
}

async function getData<T = unknown>(query: string, params?: any[]): Promise<T[]> {
  const conn: PoolConnection = await getConnection();
  const [rows] = await conn.query<T & RowDataPacket[][]>(query, params);
  conn.release();

  return rows as T[];
}

async function execTransaction<T = unknown>(query: string, params?: any[]): Promise<T> {
  const conn: PoolConnection = await getConnection();
  try {
    // Iniciar transacción
    await conn.beginTransaction();

    // Ejecutar consulta
    const [rows] = await conn.query<T & RowDataPacket[][]>(query, params);

    // Hacer commit si no hay errores
    await conn.commit();

    return rows as T;
  } catch (err) {
    // En caso de error, hacer rollback y lanzar la excepción
    await conn.rollback();
    throw err;
  } finally {
    // Liberar la conexión
    conn.release();
  }
}

async function execQuery<T = unknown>(query: string, params?: any[]): Promise<T> {
  const conn: PoolConnection = await getConnection();
  try {
    // Ejecutar consulta
    const [rows] = await conn.query<T & RowDataPacket[][]>(query, params);

    return rows as T;
  } catch (err) {
    throw err;
  } finally {
    // Liberar la conexión
    conn.release();
  }
}

async function execQueryWithCallback<T = unknown>(callback = (conn: PoolConnection) => { }): Promise<T> {
  const conn: PoolConnection = await getConnection();
  try {
    // Iniciar transacción
    await conn.beginTransaction();

    // Ejecutar consulta
    await callback(conn);

    // Hacer commit si no hay errores
    await conn.commit();

    return {} as T;
  } catch (err) {
    // En caso de error, hacer rollback y lanzar la excepción
    await conn.rollback();
    throw err;
  } finally {
    // Liberar la conexión
    conn.release();
  }
}

export { mysqlLoader, mysqlConnectionPool, execQuery, execQueryWithCallback, execTransaction, getData, getConnection };
