export class CarUsageService {
  constructor(carUsageRepository, carRepository, driverRepository) {
    this.carUsageRepository = carUsageRepository;
    this.carRepository = carRepository;
    this.driverRepository = driverRepository;
  }

  async startUsage({ carId, driverId, reason, startDate }) {
    if (!carId) throw new Error('Carro é obrigatório.');
    if (!driverId) throw new Error('Motorista é obrigatório.');
    if (!reason || !reason.trim()) {
      throw new Error('Motivo da utilização é obrigatório.');
    }

    const car = await this.carRepository.findById(carId);
    if (!car) {
      throw new Error('Automóvel não encontrado.');
    }

    const driver = await this.driverRepository.findById(driverId);
    if (!driver) {
      throw new Error('Motorista não encontrado.');
    }

    const isVehicleInUsage =
      await this.carUsageRepository.findActiveByCarId(carId);
    if (isVehicleInUsage) {
      throw new Error('Este automóvel já está em utilização.');
    }

    const isDriverWithVehicle =
      await this.carUsageRepository.findActiveByDriverId(driverId);
    if (isDriverWithVehicle) {
      throw new Error('Este motorista já está utilizando um automóvel.');
    }

    const now = new Date();
    const start = startDate ? new Date(startDate) : now;

    return this.carUsageRepository.create({
      carId,
      driverId,
      reason: reason.trim(),
      startDate: start
    });
  }

  async finishUsage(id, endDate) {
    const usage = await this.carUsageRepository.findById(id);
    if (!usage) {
      throw new Error('Utilização não encontrada.');
    }

    if (usage.endDate) {
      throw new Error('Utilização já foi finalizada.');
    }

    const end = endDate ? new Date(endDate) : new Date();

    return this.carUsageRepository.finishUsage(id, end);
  }

  async listUsages() {
    return this.carUsageRepository.listAll();
  }

  async getUsageById(id) {
    const usage = await this.carUsageRepository.findById(id);
    if (!usage) {
      throw new Error('Utilização não encontrada.');
    }
    return usage;
  }
}
