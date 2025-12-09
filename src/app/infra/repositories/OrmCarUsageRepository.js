import { CarUsageRepository } from '../../domain/repositories/CarUsageRepository.js';
import { CarUsage } from '../../domain/entities/CarUsage.js';
import { IsNull } from 'typeorm';

export class OrmCarUsageRepository extends CarUsageRepository {
  constructor(dataSource) {
    super();
    this.dataSource = dataSource;
  }

  get repository() {
    return this.dataSource.getRepository('CarUsage');
  }

  async create({ carId, driverId, startDate, reason }) {
    const entity = this.repository.create({
      startDate,
      endDate: null,
      reason,
      car: { id: carId },
      driver: { id: driverId }
    });

    const saved = await this.repository.save(entity);

    return new CarUsage({
      id: saved.id,
      carId,
      driverId,
      startDate: saved.startDate,
      endDate: saved.endDate,
      reason: saved.reason,
      createdAt: saved.createdAt
    });
  }

  async findById(id) {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['car', 'driver']
    });

    if (!entity) return null;

    return {
      id: entity.id,
      startDate: entity.startDate,
      endDate: entity.endDate,
      reason: entity.reason,
      createdAt: entity.createdAt,
      car: entity.car,
      driver: entity.driver
    };
  }

  async findActiveCarById(carId) {
    const entity = await this.repository.findOne({
      where: {
        car: { id: carId },
        endDate: IsNull()
      },
      relations: ['car', 'driver']
    });

    if (!entity) return null;

    return {
      id: entity.id,
      carId,
      driverId: entity.driver.id,
      startDate: entity.startDate,
      endDate: entity.endDate,
      reason: entity.reason,
      createdAt: entity.createdAt
    };
  }

  async findActiveDriverById(driverId) {
    const entity = await this.repository.findOne({
      where: {
        driver: { id: driverId },
        endDate: IsNull()
      },
      relations: ['car', 'driver']
    });

    if (!entity) return null;

    return {
      id: entity.id,
      carId: entity.car.id,
      driverId,
      startDate: entity.startDate,
      endDate: entity.endDate,
      reason: entity.reason,
      createdAt: entity.createdAt
    };
  }

  async finishUsage(id, endDate) {
    await this.repository.update(id, { endDate });

    const updated = await this.repository.findOne({
      where: { id },
      relations: ['car', 'driver']
    });

    if (!updated) return null;

    return {
      id: updated.id,
      startDate: updated.startDate,
      endDate: updated.endDate,
      reason: updated.reason,
      createdAt: updated.createdAt,
      car: updated.car,
      driver: updated.driver
    };
  }

  async listAll() {
    const entities = await this.repository.find({
      relations: ['car', 'driver'],
      order: { startDate: 'DESC' }
    });

    return entities.map((usage) => ({
      id: usage.id,
      startDate: usage.startDate,
      endDate: usage.endDate,
      reason: usage.reason,
      createdAt: usage.createdAt,
      car: usage.car,
      driver: usage.driver
    }));
  }
}
