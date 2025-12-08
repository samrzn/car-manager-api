import 'dotenv/config';

export const env = {
  PORT: process.env.PORT ?? 3000,
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  DB_HOST: process.env.DB_HOST ?? 'localhost',
  DB_PORT: Number(process.env.DB_PORT ?? 5432),
  DB_USER: process.env.DB_USER ?? 'app_user',
  DB_PASS: process.env.DB_PASS ?? 'app_password',
  DB_NAME: process.env.DB_NAME ?? 'car_manager_db'
};
