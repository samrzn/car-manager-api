import { Router } from 'express';
import { carUsageController } from '../controllers/CarUsageController.js';

export const carUsageRoutes = Router();

carUsageRoutes.post('/', carUsageController.start);
carUsageRoutes.patch('/:id/finish', carUsageController.finish);
carUsageRoutes.get('/', carUsageController.list);
carUsageRoutes.get('/:id', carUsageController.getById);
