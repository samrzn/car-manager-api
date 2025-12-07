import AppDataSource from './data-source.js';
import { OrmDriverRepository } from '../infra/repositories/OrmDriverRepository.js';
import { DriverService } from '../domain/services/DriverService.js';

export function makeDriverService() {
  const driverRepository = new OrmDriverRepository(AppDataSource);
  return new DriverService(driverRepository);
}
