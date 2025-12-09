import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from './env.js';
import { DriverEntity } from '../infra/db/entities/DriverEntity.js';
import { CarEntity } from '../infra/db/entities/CarEntity.js';
import { CarUsageEntity } from '../infra/db/entities/CarUsageEntity.js';

const isProd = env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  entities: [DriverEntity, CarEntity, CarUsageEntity],
  synchronize: !isProd,
  logging: !isProd
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function initializeDataSourceWithRetry(
  dataSource = AppDataSource,
  { retries = 5, initialDelayMs = 2000 } = {}
) {
  let attempt = 0;

  while (attempt <= retries) {
    try {
      if (dataSource.isInitialized) {
        return dataSource;
      }

      attempt += 1;
      console.log(
        `Trying to initialize Data Source (attempt ${attempt} of ${
          retries + 1
        })...`
      );

      await dataSource.initialize();

      console.log('Data Source successfully initialized.');
      return dataSource;
    } catch (error) {
      console.error(
        `Error initializing Data Source (attempt ${attempt} of ${
          retries + 1
        }):`,
        error.message ?? error
      );

      if (attempt > retries) {
        console.error('Maximum number of attempts reached. Closing process.');
        process.exit(1);
      }

      const delay = initialDelayMs * attempt;
      console.log(`Waiting for ${delay}ms before the next attempt...`);
      await sleep(delay);
    }
  }

  return dataSource;
}

export default AppDataSource;
