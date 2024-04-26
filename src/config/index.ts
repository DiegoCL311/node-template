import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT || 3000,
  database: {
    mongo: {
      uri: process.env.MONGO_URI || "mongodb://localhost:27017/test",
    },
    mssql: {
      user: process.env.MSSQL_USER || "",
      password: process.env.MSSQL_PASSWORD || "",
      server: process.env.MSSQL_SERVER || "",
      database: process.env.MSSQL_DATABASE || "",
      port: process.env.MSSQL_PORT || "",
    },
    mysql: {
      host: process.env.MYSQL_HOST || "",
      user: process.env.MYSQL_USER || "",
      password: process.env.MYSQL_PASSWORD || "",
      database: process.env.MYSQL_DATABASE || "",
      port: process.env.MYSQL_PORT || "",
    },
    postgres: {
      user: process.env.POSTGRES_USER || "",
      password: process.env.POSTGRES_PASSWORD || "",
      host: process.env.POSTGRES_HOST || "",
      database: process.env.POSTGRES_DATABASE || "",
      port: process.env.POSTGRES_PORT || "",
      uri: process.env.POSTGRES_URI || "",
    },
  },
  jwt: {
    public: process.env.JWT_PUBLIC_KEY || "",
    private: process.env.JWT_PRIVATE_KEY || "",
    expiryTime: process.env.JWT_EXPIRY_TIME || 3600,
    issuer: process.env.JWT_ISSUER || "issuer",
    audience: process.env.JWT_AUDIENCE || "audience",
  },
};
