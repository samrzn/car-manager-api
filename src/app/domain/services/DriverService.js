export class DriverService {
  constructor(driverRepository) {
    this.driverRepository = driverRepository;
  }

  _normalizeCpf(cpf) {
    if (!cpf) return '';
    return cpf.replaceAll(/\D/g, '');
  }

  _validateCpfBasic(cpf) {
    const normalized = this._normalizeCpf(cpf);

    if (normalized.length !== 11) {
      throw new Error('CPF deve conter 11 dígitos numéricos.');
    }

    return normalized;
  }

  async createDriver({ name, cpf }) {
    if (!name?.trim()) {
      throw new Error('Nome do motorista é obrigatório.');
    }

    const normalizedCpf = this._validateCpfBasic(cpf);

    const existing = await this.driverRepository.findByCpf(normalizedCpf);
    if (existing) {
      throw new Error('Já existe um motorista com este CPF.');
    }

    return this.driverRepository.create({
      name: name.trim(),
      cpf: normalizedCpf
    });
  }

  async updateDriver(id, { name, cpf }) {
    const driver = await this.driverRepository.findById(id);

    if (!driver) {
      throw new Error('Motorista não encontrado.');
    }

    if (name !== undefined) {
      if (!name?.trim()) {
        throw new Error('Nome do motorista é obrigatório.');
      }
      driver.name = name.trim();
    }

    if (cpf !== undefined) {
      const normalizedCpf = this._validateCpfBasic(cpf);
      const existing = await this.driverRepository.findByCpf(normalizedCpf);

      if (existing && String(existing.id) !== String(id)) {
        throw new Error('Já existe um motorista com este CPF.');
      }

      driver.cpf = normalizedCpf;
    }

    return this.driverRepository.update(driver);
  }

  async getDriverById(id) {
    const driver = await this.driverRepository.findById(id);
    if (!driver) {
      throw new Error('Motorista não encontrado.');
    }
    return driver;
  }

  async listDrivers({ name }) {
    const normalizedName = name?.trim();

    if (normalizedName) {
      return this.driverRepository.findByName(normalizedName);
    }

    return this.driverRepository.findAll();
  }

  async deleteDriver(id) {
    const driver = await this.driverRepository.findById(id);
    if (!driver) {
      throw new Error('Motorista não encontrado.');
    }

    await this.driverRepository.delete(id);
  }
}
