import 'dotenv/config';

function connectionTreatment(message) {
  console.error(`Configuration error: ${message}`);
  process.exit(1);
}

function buildRawEnv() {
  return {
    PORT: process.env.PORT ?? 3000,
    NODE_ENV: process.env.NODE_ENV ?? 'development',
    DB_HOST: process.env.DB_HOST ?? 'localhost',
    DB_PORT: Number(process.env.DB_PORT ?? 5432),
    DB_USER: process.env.DB_USER ?? 'app_user',
    DB_PASS: process.env.DB_PASS,
    DB_NAME: process.env.DB_NAME ?? 'car_manager_db'
  };
}

function validateEnv(rawEnv) {
  const env = { ...rawEnv };

  const isProd = env.NODE_ENV === 'production';

  if (!env.DB_HOST || typeof env.DB_HOST !== 'string') {
    connectionTreatment('DB_HOST is required and must be a valid string.');
  }

  if (!env.DB_USER || typeof env.DB_USER !== 'string') {
    connectionTreatment('DB_USER is required and must be a valid string.');
  }

  if (!env.DB_NAME || typeof env.DB_NAME !== 'string') {
    connectionTreatment('DB_NAME is required and must be a valid string.');
  }

  if (!Number.isInteger(env.DB_PORT) || env.DB_PORT <= 0) {
    connectionTreatment('DB_PORT must be a positive integer.');
  }

  if (isProd) {
    if (!env.DB_PASS || env.DB_PASS.trim().length === 0) {
      connectionTreatment(
        'DB_PASS is mandatory in a production environment and cannot be empty.'
      );
    }
  } else if (!env.DB_PASS || env.DB_PASS.trim().length === 0) {
    env.DB_PASS = 'app_password';
    console.warn(
      'DB_PASS not defined. Using default value only for non-productive environment.'
    );
  }

  env.PORT = Number(env.PORT);
  if (!Number.isInteger(env.PORT) || env.PORT <= 0) {
    connectionTreatment('PORT must be a positive integer.');
  }

  env.PORT = Number(env.PORT);
  if (!Number.isInteger(env.PORT) || env.PORT <= 0) {
    connectionTreatment('PORT deve ser um número inteiro positivo.');
  }

  return Object.freeze(env);
}

const rawEnv = buildRawEnv();
export const env = validateEnv(rawEnv);
