import { Router } from 'express';
import { driverController } from '../controllers/DriverController.js';

export const driverRoutes = Router();

driverRoutes.post('/', driverController.create);
driverRoutes.get('/', driverController.list);
driverRoutes.get('/:id', driverController.getById);
driverRoutes.put('/:id', driverController.update);
driverRoutes.delete('/:id', driverController.remove);
