import { Router } from 'express';
import { healthRoutes } from './HealthRoutes.js';
import { driverRoutes } from './DriverRoutes.js';
import { carRoutes } from './CarRoutes.js';
import { carUsageRoutes } from './CarUsageRoutes.js';

export const routes = Router();

routes.use(healthRoutes);

routes.use('/drivers', driverRoutes);
routes.use('/cars', carRoutes);
routes.use('/usages', carUsageRoutes);
