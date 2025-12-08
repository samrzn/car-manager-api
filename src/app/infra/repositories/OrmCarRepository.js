import { CarRepository } from '../../domain/repositories/CarRepository.js';
import { Car } from '../../domain/entities/Car.js';

export class OrmCarRepository extends CarRepository {
  constructor(dataSource) {
    super();
    this.dataSource = dataSource;
  }

  get repository() {
    return this.dataSource.getRepository('Car');
  }

  async create({ plate, color, brand }) {
    const entity = this.repository.create({ plate, color, brand });
    const saved = await this.repository.save(entity);
    return new Car(saved);
  }

  async findById(id) {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? new Car(entity) : null;
  }

  async findByPlate(plate) {
    const entity = await this.repository.findOne({ where: { plate } });
    return entity ? new Car(entity) : null;
  }

  async findAll() {
    const entities = await this.repository.find();
    return entities.map((e) => new Car(e));
  }

  async findByFilters({ color, brand }) {
    const qb = this.repository.createQueryBuilder('car');

    if (color) {
      qb.andWhere('LOWER(car.color) = LOWER(:color)', { color });
    }

    if (brand) {
      qb.andWhere('LOWER(car.brand) = LOWER(:brand)', { brand });
    }

    const entities = await qb.getMany();
    return entities.map((e) => new Car(e));
  }

  async update(carData) {
    await this.repository.update(carData.id, {
      plate: carData.plate,
      color: carData.color,
      brand: carData.brand
    });

    return this.findById(carData.id);
  }

  async delete(id) {
    await this.repository.delete(id);
  }
}
