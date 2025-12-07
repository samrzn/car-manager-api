import { DriverRepository } from '../../domain/repositories/DriverRepository.js';
import { Driver } from '../../domain/entities/Driver.js';

export class OrmDriverRepository extends DriverRepository {
  constructor(dataSource) {
    super();
    this.dataSource = dataSource;
  }

  get repository() {
    return this.dataSource.getRepository('Driver');
  }

  async create({ name, cpf }) {
    const entity = this.repository.create({ name, cpf });
    const saved = await this.repository.save(entity);
    return new Driver(saved);
  }

  async findById(id) {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? new Driver(entity) : null;
  }

  async findByCpf(cpf) {
    const entity = await this.repository.findOne({ where: { cpf } });
    return entity ? new Driver(entity) : null;
  }

  async findByName(name) {
    const qb = this.repository.createQueryBuilder('driver');

    qb.where('LOWER(driver.name) LIKE LOWER(:name)', {
      name: `%${name}%`
    });

    const entities = await qb.getMany();
    return entities.map((e) => new Driver(e));
  }

  async findAll() {
    const entities = await this.repository.find();
    return entities.map((e) => new Driver(e));
  }

  async update(driverData) {
    await this.repository.update(driverData.id, {
      name: driverData.name,
      cpf: driverData.cpf
    });

    return this.findById(driverData.id);
  }

  async delete(id) {
    await this.repository.delete(id);
  }
}
