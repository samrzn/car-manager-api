import express from 'express';
import { routes } from './presentation/index.js';
import { env } from './config/env.js';

const app = express();

app.use(express.json());
app.use(routes);

console.log(`App started in environment ${env.NODE_ENV}.`);

export default app;
