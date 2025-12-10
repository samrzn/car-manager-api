export class CarService {
  constructor(carRepository) {
    this.carRepository = carRepository;
  }

  _normalizePlate(plate) {
    return (
      plate
        ?.trim()
        .replaceAll(/[^a-zA-Z0-9]/g, '')
        .toUpperCase() ?? ''
    );
  }

  async createCar({ plate, color, brand }) {
    const normalizedPlate = this._normalizePlate(plate);

    if (!normalizedPlate) {
      throw new Error('Placa do automóvel é obrigatória.');
    }

    if (!color?.trim()) {
      throw new Error('Cor do automóvel é obrigatória.');
    }

    if (!brand?.trim()) {
      throw new Error('Marca do automóvel é obrigatória.');
    }

    const existing = await this.carRepository.findByPlate(normalizedPlate);
    if (existing) {
      throw new Error('Já existe um automóvel com esta placa.');
    }

    return this.carRepository.create({
      plate: normalizedPlate,
      color: color.trim(),
      brand: brand.trim()
    });
  }

  async updateCar(id, { plate, color, brand }) {
    const car = await this.carRepository.findById(id);
    if (!car) {
      throw new Error('Automóvel não encontrado.');
    }

    if (plate !== undefined) {
      const normalizedPlate = this._normalizePlate(plate);
      if (!normalizedPlate) {
        throw new Error('Placa do automóvel é obrigatória.');
      }

      const existing = await this.carRepository.findByPlate(normalizedPlate);
      if (existing && String(existing.id) !== String(id)) {
        throw new Error('Já existe um automóvel com esta placa.');
      }

      car.plate = normalizedPlate;
    }

    if (color !== undefined) {
      if (!color?.trim()) {
        throw new Error('Cor do automóvel é obrigatória.');
      }
      car.color = color.trim();
    }

    if (brand !== undefined) {
      if (!brand?.trim()) {
        throw new Error('Marca do automóvel é obrigatória.');
      }
      car.brand = brand.trim();
    }

    return this.carRepository.update(car);
  }

  async getCarById(id) {
    const car = await this.carRepository.findById(id);
    if (!car) {
      throw new Error('Automóvel não encontrado.');
    }
    return car;
  }

  async listCars({ color, brand }) {
    const normalizedColor = color?.trim();
    const normalizedBrand = brand?.trim();

    if (normalizedColor || normalizedBrand) {
      return this.carRepository.findByFilters({
        color: normalizedColor,
        brand: normalizedBrand
      });
    }

    return this.carRepository.findAll();
  }

  async deleteCar(id) {
    const car = await this.carRepository.findById(id);
    if (!car) {
      throw new Error('Automóvel não encontrado.');
    }

    await this.carRepository.delete(id);
  }
}
