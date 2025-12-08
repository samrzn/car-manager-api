import AppDataSource from './data-source.js';
import { OrmDriverRepository } from '../infra/repositories/OrmDriverRepository.js';
import { OrmCarRepository } from '../infra/repositories/OrmCarRepository.js';
import { OrmCarUsageRepository } from '../infra/repositories/OrmCarUsageRepository.js';
import { DriverService } from '../domain/services/DriverService.js';
import { CarService } from '../domain/services/CarService.js';
import { CarUsageService } from '../domain/services/CarUsageService.js';

export function makeDriverService() {
  const repo = new OrmDriverRepository(AppDataSource);
  return new DriverService(repo);
}

export function makeCarService() {
  const repo = new OrmCarRepository(AppDataSource);
  return new CarService(repo);
}

export function makeCarUsageService() {
  const usageRepo = new OrmCarUsageRepository(AppDataSource);
  const carRepo = new OrmCarRepository(AppDataSource);
  const driverRepo = new OrmDriverRepository(AppDataSource);

  return new CarUsageService(usageRepo, carRepo, driverRepo);
}
