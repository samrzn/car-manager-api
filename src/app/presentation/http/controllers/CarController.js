export class CarController {
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
      const { plate, color, brand } = req.body;

      const car = await this.service.createCar({ plate, color, brand });

      return res.status(201).json(car);
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        error: error.message ?? 'Erro ao criar automóvel.'
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;

      const car = await this.service.getCarById(id);

      return res.status(200).json(car);
    } catch (error) {
      console.error(error);

      if (error.message?.includes('Não encontrado')) {
        return res.status(404).json({ error: error.message });
      }

      return res.status(400).json({
        error: error.message ?? 'Erro ao buscar automóvel.'
      });
    }
  }

  async list(req, res) {
    try {
      const { color, brand } = req.query;

      const cars = await this.service.listCars({ color, brand });

      return res.status(200).json(cars);
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        error: error.message ?? 'Erro ao listar automóveis.'
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { plate, color, brand } = req.body;

      const car = await this.service.updateCar(id, { plate, color, brand });

      return res.status(200).json(car);
    } catch (error) {
      console.error(error);

      if (error.message?.includes('Não encontrado')) {
        return res.status(404).json({ error: error.message });
      }

      return res.status(400).json({
        error: error.message ?? 'Erro ao atualizar automóvel.'
      });
    }
  }

  async remove(req, res) {
    try {
      const { id } = req.params;

      await this.service.deleteCar(id);

      return res.status(204).send();
    } catch (error) {
      console.error(error);

      if (error.message?.includes('Não encontrado')) {
        return res.status(404).json({ error: error.message });
      }

      return res.status(400).json({
        error: error.message ?? 'Erro ao remover automóvel.'
      });
    }
  }
}

export const carController = new CarController();
