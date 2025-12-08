export class CarUsageRepository {
  async create(usageData) {
    throw new Error('Method not implemented: create');
  }

  async findById(id) {
    throw new Error('Method not implemented: findById');
  }

  async findActiveByCarId(carId) {
    throw new Error('Method not implemented: findActiveByCarId');
  }

  async findActiveByDriverId(driverId) {
    throw new Error('Method not implemented: findActiveByDriverId');
  }

  async finishUsage(id, endDate) {
    throw new Error('Method not implemented: finishUsage');
  }

  async listAll() {
    throw new Error('Method not implemented: listAll');
  }
}
