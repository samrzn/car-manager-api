import { makeCarUsageService } from '../../../config/container.js';

const carUsageService = makeCarUsageService();

export class CarUsageController {
  constructor(service) {
    this.service = service;

    this.start = this.start.bind(this);
    this.finish = this.finish.bind(this);
    this.list = this.list.bind(this);
    this.getById = this.getById.bind(this);
  }

  async start(req, res) {
    try {
      const { carId, driverId, reason, startDate } = req.body;

      const usage = await this.service.startUsage({
        carId,
        driverId,
        reason,
        startDate
      });

      return res.status(201).json(usage);
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        error: error.message ?? 'Erro ao iniciar utilização do automóvel.'
      });
    }
  }

  async finish(req, res) {
    try {
      const { id } = req.params;
      const { endDate } = req.body;

      const usage = await this.service.finishUsage(id, endDate);

      return res.status(200).json(usage);
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        error: error.message ?? 'Erro ao finalizar utilização do automóvel.'
      });
    }
  }

  async list(req, res) {
    try {
      const usages = await this.service.listUsages();

      return res.status(200).json(usages);
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        error: error.message ?? 'Erro ao listar utilizações.'
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;

      const usage = await this.service.getUsageById(id);

      return res.status(200).json(usage);
    } catch (error) {
      console.error(error);

      if (error.message && error.message.includes('Não encontrada')) {
        return res.status(404).json({ error: error.message });
      }

      return res.status(400).json({
        error: error.message ?? 'Erro ao buscar utilização.'
      });
    }
  }
}

export const carUsageController = new CarUsageController(carUsageService);
