import AppDataSource from './data-source.js';
import { OrmDriverRepository } from '../infra/repositories/OrmDriverRepository.js';
import { OrmCarRepository } from '../infra/repositories/OrmCarRepository.js';
import { OrmCarUsageRepository } from '../infra/repositories/OrmCarUsageRepository.js';
import { DriverService } from '../domain/services/DriverService.js';
import { CarService } from '../domain/services/CarService.js';
import { CarUsageService } from '../domain/services/CarUsageService.js';

export function createRepositories(dataSource = AppDataSource) {
  const driverRepository = new OrmDriverRepository(dataSource);
  const carRepository = new OrmCarRepository(dataSource);
  const carUsageRepository = new OrmCarUsageRepository(dataSource);

  return {
    driverRepository,
    carRepository,
    carUsageRepository
  };
}

export function createServices(repositories) {
  const { driverRepository, carRepository, carUsageRepository } = repositories;

  const driverService = new DriverService(driverRepository);
  const carService = new CarService(carRepository);
  const carUsageService = new CarUsageService(
    carUsageRepository,
    carRepository,
    driverRepository
  );

  return {
    driverService,
    carService,
    carUsageService
  };
}

export function createAppContainer(dataSource = AppDataSource) {
  const repositories = createRepositories(dataSource);
  const services = createServices(repositories);

  return {
    ...repositories,
    ...services
  };
}
