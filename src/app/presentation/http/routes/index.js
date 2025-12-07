import { Router } from 'express';
import { healthRoutes } from './HealthRoutes.js';
import { driverRoutes } from './DriverRoutes.js';

export const routes = Router();

routes.use(healthRoutes);

// Aqui depois você vai adicionar:
routes.use('/drivers', driverRoutes);
// routes.use('/cars', carRoutes);
// routes.use('/usages', usageRoutes);
