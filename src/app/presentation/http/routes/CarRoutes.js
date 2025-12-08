import { Router } from 'express';
import { carController } from '../controllers/CarController.js';

export const carRoutes = Router();

carRoutes.post('/', carController.create);
carRoutes.get('/', carController.list);
carRoutes.get('/:id', carController.getById);
carRoutes.put('/:id', carController.update);
carRoutes.delete('/:id', carController.remove);
