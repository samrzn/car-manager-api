import 'reflect-metadata';
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
