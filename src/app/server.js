import app from './app.js';
import { env } from './config/env.js';
import {
  AppDataSource,
  initializeDataSourceWithRetry
} from './config/data-source.js';
import { createAppContainer } from './config/container.js';
import { driverController } from './presentation/http/controllers/DriverController.js';
import { carController } from './presentation/http/controllers/CarController.js';
import { carUsageController } from './presentation/http/controllers/CarUsageController.js';

(async () => {
  await initializeDataSourceWithRetry(AppDataSource);

  const { driverService, carService, carUsageService } =
    createAppContainer(AppDataSource);

  driverController.service = driverService;
  carController.service = carService;
  carUsageController.service = carUsageService;

  app.listen(env.PORT, () => {
    console.log(`Car Manager API rodando na porta ${env.PORT}`);
  });
})();
