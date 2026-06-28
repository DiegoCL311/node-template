import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  MYSQL_HOST: z.string().min(1),
  MYSQL_USER: z.string().min(1),
  MYSQL_PASSWORD: z.string().min(1),
  MYSQL_DATABASE: z.string().min(1),
  MYSQL_PORT: z.string().transform(Number).default('3306'),
  JWT_PUBLIC_KEY: z.string().min(1),
  JWT_PRIVATE_KEY: z.string().min(1),
  JWT_EXPIRY_TIME: z.string().transform(Number).default('3600'),
  JWT_ISSUER: z.string().default('issuer'),
  JWT_AUDIENCE: z.string().default('audience'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1);
}

const env = _env.data;

export const environment = env.NODE_ENV;
export const port = env.PORT;
export const corsOrigin = env.CORS_ORIGIN;

export const database = {
  host: env.MYSQL_HOST,
  user: env.MYSQL_USER,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE,
  port: env.MYSQL_PORT,
};

export const jwt = {
  public: env.JWT_PUBLIC_KEY,
  private: env.JWT_PRIVATE_KEY,
  expiryTime: env.JWT_EXPIRY_TIME,
  issuer: env.JWT_ISSUER,
  audience: env.JWT_AUDIENCE,
};

export default {
  environment,
  port,
  database,
  jwt,
};
