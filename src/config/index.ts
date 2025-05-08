import dotenv from "dotenv";

dotenv.config();

export const environment = process.env.NODE_ENV;
export const port = process.env.PORT;

export const db = {
  port: process.env.PORT || 3000,
  database: {
    mysql: {
      host: process.env.MYSQL_HOST || "",
      user: process.env.MYSQL_USER || "",
      password: process.env.MYSQL_PASSWORD || "",
      database: process.env.MYSQL_DATABASE || "",
      port: process.env.MYSQL_PORT || "",
    },
  },
};

export const jwt = {
  public: process.env.JWT_PUBLIC_KEY || "",
  private: process.env.JWT_PRIVATE_KEY || "",
  expiryTime: Number(process.env.JWT_EXPIRY_TIME) || 3600,
  issuer: process.env.JWT_ISSUER || "issuer",
  audience: process.env.JWT_AUDIENCE || "audience",
}

