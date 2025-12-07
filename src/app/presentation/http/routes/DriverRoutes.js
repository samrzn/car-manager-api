import { Router } from 'express';
import { DriverController } from '../controllers/DriverController.js';

export const driverRoutes = Router();

driverRoutes.post('/', DriverController.create);
driverRoutes.get('/', DriverController.list);
driverRoutes.get('/:id', DriverController.getById);
driverRoutes.put('/:id', DriverController.update);
driverRoutes.delete('/:id', DriverController.remove);
