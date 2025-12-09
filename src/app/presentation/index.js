import { Router } from 'express';
import { healthRoutes } from './http/routes/HealthRoutes.js';
import { driverRoutes } from './http/routes/DriverRoutes.js';
import { carRoutes } from './http/routes/CarRoutes.js';
import { carUsageRoutes } from './http/routes/CarUsageRoutes.js';

export const routes = Router();

routes.use(healthRoutes);

routes.use('/drivers', driverRoutes);
routes.use('/cars', carRoutes);
routes.use('/usages', carUsageRoutes);
