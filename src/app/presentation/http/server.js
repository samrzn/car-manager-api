import express from 'express';
import { driverRoutes } from './routes/DriverRoutes.js';
import { carRoutes } from './routes/CarRoutes.js';
import { carUsageRoutes } from './routes/CarUsageRoutes.js';
import { healthRoutes } from './routes/HealthRoutes.js';

const app = express();

app.use(express.json());
app.use(healthRoutes);
app.use('/drivers', driverRoutes);
app.use('/cars', carRoutes);
app.use('/usages', carUsageRoutes);

export default app;
