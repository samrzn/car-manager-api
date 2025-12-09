export class DriverController {
  constructor(service) {
    this.service = service;

    this.create = this.create.bind(this);
    this.getById = this.getById.bind(this);
    this.list = this.list.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
  }

  async create(req, res) {
    try {
      const { name, cpf } = req.body;

      const driver = await this.service.createDriver({ name, cpf });

      return res.status(201).json(driver);
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        error: error.message ?? 'Erro ao criar motorista.'
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;

      const driver = await this.service.getDriverById(id);

      return res.status(200).json(driver);
    } catch (error) {
      console.error(error);

      if (error.message && error.message.includes('não encontrado')) {
        return res.status(404).json({ error: error.message });
      }

      return res.status(400).json({
        error: error.message ?? 'Erro ao buscar motorista.'
      });
    }
  }

  async list(req, res) {
    try {
      const { name } = req.query;

      const drivers = await this.service.listDrivers({ name });

      return res.status(200).json(drivers);
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        error: error.message ?? 'Erro ao listar motoristas.'
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, cpf } = req.body;

      const driver = await this.service.updateDriver(id, { name, cpf });

      return res.status(200).json(driver);
    } catch (error) {
      console.error(error);

      if (error.message && error.message.includes('não encontrado')) {
        return res.status(404).json({ error: error.message });
      }

      return res.status(400).json({
        error: error.message ?? 'Erro ao atualizar motorista.'
      });
    }
  }

  async remove(req, res) {
    try {
      const { id } = req.params;

      await this.service.deleteDriver(id);

      return res.status(204).send();
    } catch (error) {
      console.error(error);

      if (error.message && error.message.includes('não encontrado')) {
        return res.status(404).json({ error: error.message });
      }

      return res.status(400).json({
        error: error.message ?? 'Erro ao remover motorista.'
      });
    }
  }
}

export const driverController = new DriverController();
