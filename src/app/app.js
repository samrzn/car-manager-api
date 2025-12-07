import express from 'express';
import AppDataSource from './config/data-source.js';
import { env } from './config/env.js';
import { routes } from './presentation/http/routes/index.js';

const app = express();

app.use(express.json());
app.use(routes);

if (env.NODE_ENV !== 'test') {
  AppDataSource.initialize()
    .then(() => {
      console.log('📦 Database connected');

      app.listen(env.PORT, () => {
        console.log(`🚀 Server running on port ${env.PORT}`);
      });
    })
    .catch((error) => {
      console.error('❌ Error during Data Source initialization', error);
      process.exit(1);
    });
}

export default app;
