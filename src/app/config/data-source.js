/* import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from './env.js';
import { DriverEntity } from '../infra/db/entities/DriverEntity.js';
import { CarEntity } from '../infra/db/entities/CarEntity.js';
import { CarUsageEntity } from '../infra/db/entities/CarUsageEntity.js';

const isProd = env.NODE_ENV === 'production';

const AppDataSource = new DataSource({
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

export default AppDataSource;
 */

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
        `Tentando inicializar Data Source (tentativa ${attempt} de ${
          retries + 1
        })...`
      );

      await dataSource.initialize();

      console.log('Data Source inicializado com sucesso.');
      return dataSource;
    } catch (error) {
      console.error(
        `Erro ao inicializar Data Source (tentativa ${attempt} de ${
          retries + 1
        }):`,
        error.message ?? error
      );

      if (attempt > retries) {
        console.error(
          'Número máximo de tentativas atingido. Encerrando o processo.'
        );
        process.exit(1);
      }

      const delay = initialDelayMs * attempt;
      console.log(`Aguardando ${delay}ms antes da próxima tentativa...`);
      await sleep(delay);
    }
  }

  return dataSource;
}

export default AppDataSource;
