import { jest } from '@jest/globals';
import { DriverService } from '../../../../app/domain/services/DriverService.js';

describe('DriverService', () => {
  let driverRepository;
  let service;

  beforeEach(() => {
    driverRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByCpf: jest.fn(),
      findByName: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };

    service = new DriverService(driverRepository);
  });

  test('deve criar motorista com CPF normalizado', async () => {
    driverRepository.findByCpf.mockResolvedValue(null);
    driverRepository.create.mockResolvedValue({
      id: '1',
      name: 'João da Silva',
      cpf: '12345678909'
    });

    const result = await service.createDriver({
      name: 'João da Silva',
      cpf: '123.456.789-09'
    });

    expect(driverRepository.findByCpf).toHaveBeenCalledWith('12345678909');
    expect(driverRepository.create).toHaveBeenCalledWith({
      name: 'João da Silva',
      cpf: '12345678909'
    });
    expect(result.cpf).toBe('12345678909');
  });

  test('deve lançar erro se nome do motorista estiver vazio', async () => {
    await expect(
      service.createDriver({ name: '', cpf: '12345678909' })
    ).rejects.toThrow('Nome do motorista é obrigatório.');
    expect(driverRepository.create).not.toHaveBeenCalled();
  });

  test('deve lançar erro se CPF tiver tamanho inválido', async () => {
    await expect(
      service.createDriver({ name: 'João', cpf: '1234' })
    ).rejects.toThrow('CPF deve conter 11 dígitos numéricos.');
    expect(driverRepository.create).not.toHaveBeenCalled();
  });

  test('não deve permitir CPF duplicado na criação', async () => {
    driverRepository.findByCpf.mockResolvedValue({
      id: '1',
      name: 'João da Silva',
      cpf: '12345678909'
    });

    await expect(
      service.createDriver({ name: 'João', cpf: '123.456.789-09' })
    ).rejects.toThrow('Já existe um motorista com este CPF.');

    expect(driverRepository.create).not.toHaveBeenCalled();
  });

  test('deve atualizar nome e CPF do motorista', async () => {
    const existingDriver = {
      id: '1',
      name: 'João',
      cpf: '12345678909'
    };

    driverRepository.findById.mockResolvedValue(existingDriver);
    driverRepository.findByCpf.mockResolvedValue(null);
    driverRepository.update.mockImplementation(async (driver) => driver);

    const updated = await service.updateDriver('1', {
      name: 'João Atualizado',
      cpf: '987.654.321-00'
    });

    expect(driverRepository.findById).toHaveBeenCalledWith('1');
    expect(driverRepository.findByCpf).toHaveBeenCalledWith('98765432100');
    expect(driverRepository.update).toHaveBeenCalled();
    expect(updated.name).toBe('João Atualizado');
    expect(updated.cpf).toBe('98765432100');
  });

  test('não deve permitir atualizar para CPF já existente em outro motorista', async () => {
    driverRepository.findById.mockResolvedValue({
      id: '1',
      name: 'João',
      cpf: '12345678909'
    });

    driverRepository.findByCpf.mockResolvedValue({
      id: '2',
      name: 'Maria',
      cpf: '98765432100'
    });

    await expect(
      service.updateDriver('1', { cpf: '987.654.321-00' })
    ).rejects.toThrow('Já existe um motorista com este CPF.');

    expect(driverRepository.update).not.toHaveBeenCalled();
  });

  test('deve lançar erro ao atualizar motorista inexistente', async () => {
    driverRepository.findById.mockResolvedValue(null);

    await expect(service.updateDriver('999', { name: 'Novo' })).rejects.toThrow(
      'Motorista não encontrado.'
    );
  });

  test('deve buscar motorista por id', async () => {
    driverRepository.findById.mockResolvedValue({
      id: '1',
      name: 'João',
      cpf: '12345678909'
    });

    const driver = await service.getDriverById('1');

    expect(driverRepository.findById).toHaveBeenCalledWith('1');
    expect(driver.id).toBe('1');
  });

  test('deve lançar erro ao buscar motorista inexistente por id', async () => {
    driverRepository.findById.mockResolvedValue(null);

    await expect(service.getDriverById('999')).rejects.toThrow(
      'Motorista não encontrado.'
    );
  });

  test('deve listar todos motoristas quando nome não for informado', async () => {
    driverRepository.findAll.mockResolvedValue([
      { id: '1', name: 'João', cpf: '12345678909' },
      { id: '2', name: 'Maria', cpf: '98765432100' }
    ]);

    const drivers = await service.listDrivers({});

    expect(driverRepository.findAll).toHaveBeenCalled();
    expect(drivers).toHaveLength(2);
  });

  test('deve filtrar motoristas por nome quando name for informado', async () => {
    driverRepository.findByName.mockResolvedValue([
      { id: '1', name: 'João da Silva', cpf: '12345678909' }
    ]);

    const drivers = await service.listDrivers({ name: 'João' });

    expect(driverRepository.findByName).toHaveBeenCalledWith('João');
    expect(drivers).toHaveLength(1);
    expect(drivers[0].name).toBe('João da Silva');
  });

  test('deve deletar motorista existente', async () => {
    driverRepository.findById.mockResolvedValue({
      id: '1',
      name: 'João',
      cpf: '12345678909'
    });

    driverRepository.delete.mockResolvedValue(true);

    await service.deleteDriver('1');

    expect(driverRepository.findById).toHaveBeenCalledWith('1');
    expect(driverRepository.delete).toHaveBeenCalledWith('1');
  });

  test('deve lançar erro ao deletar motorista inexistente', async () => {
    driverRepository.findById.mockResolvedValue(null);

    await expect(service.deleteDriver('999')).rejects.toThrow(
      'Motorista não encontrado.'
    );

    expect(driverRepository.delete).not.toHaveBeenCalled();
  });
});
