import { Router } from 'express';

export const healthRoutes = Router();

healthRoutes.get('/health', (req, res) => {
  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});
