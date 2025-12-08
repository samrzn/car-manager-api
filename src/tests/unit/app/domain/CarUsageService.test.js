import { jest } from '@jest/globals';
import { CarUsageService } from '../../../../app/domain/services/CarUsageService.js';

describe('CarUsageService', () => {
  let carUsageRepository;
  let carRepository;
  let driverRepository;
  let service;

  const baseCar = {
    id: 'car-1',
    plate: 'ABC1D23',
    color: 'Prata',
    brand: 'Fiat'
  };
  const baseDriver = { id: 'driver-1', name: 'João', cpf: '12345678909' };

  beforeEach(() => {
    carUsageRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findActiveByCarId: jest.fn(),
      findActiveByDriverId: jest.fn(),
      finishUsage: jest.fn(),
      listAll: jest.fn()
    };

    carRepository = {
      findById: jest.fn()
    };

    driverRepository = {
      findById: jest.fn()
    };

    service = new CarUsageService(
      carUsageRepository,
      carRepository,
      driverRepository
    );

    carRepository.findById.mockResolvedValue(baseCar);
    driverRepository.findById.mockResolvedValue(baseDriver);
    carUsageRepository.findActiveByCarId.mockResolvedValue(null);
    carUsageRepository.findActiveByDriverId.mockResolvedValue(null);
  });

  test('deve iniciar utilização quando carro e motorista estão livres', async () => {
    const now = new Date();
    const createdUsage = {
      id: 'usage-1',
      carId: baseCar.id,
      driverId: baseDriver.id,
      startDate: now,
      endDate: null,
      reason: 'Visita a cliente',
      createdAt: now
    };

    carUsageRepository.create.mockResolvedValue(createdUsage);

    const result = await service.startUsage({
      carId: baseCar.id,
      driverId: baseDriver.id,
      reason: 'Visita a cliente'
    });

    expect(carRepository.findById).toHaveBeenCalledWith(baseCar.id);
    expect(driverRepository.findById).toHaveBeenCalledWith(baseDriver.id);
    expect(carUsageRepository.findActiveByCarId).toHaveBeenCalledWith(
      baseCar.id
    );
    expect(carUsageRepository.findActiveByDriverId).toHaveBeenCalledWith(
      baseDriver.id
    );
    expect(carUsageRepository.create).toHaveBeenCalled();
    expect(result.id).toBe('usage-1');
    expect(result.endDate).toBeNull();
  });

  test('deve usar startDate informado quando fornecido', async () => {
    const customStart = new Date('2025-01-01T10:00:00Z');

    carUsageRepository.create.mockImplementation(async (data) => ({
      id: 'usage-1',
      ...data,
      createdAt: customStart
    }));

    const result = await service.startUsage({
      carId: baseCar.id,
      driverId: baseDriver.id,
      reason: 'Visita',
      startDate: customStart.toISOString()
    });

    expect(result.startDate.toISOString()).toBe(customStart.toISOString());
  });

  test('deve lançar erro se carId não for informado', async () => {
    await expect(
      service.startUsage({
        carId: null,
        driverId: baseDriver.id,
        reason: 'Motivo'
      })
    ).rejects.toThrow('Carro é obrigatório.');

    expect(carRepository.findById).not.toHaveBeenCalled();
  });

  test('deve lançar erro se driverId não for informado', async () => {
    await expect(
      service.startUsage({
        carId: baseCar.id,
        driverId: null,
        reason: 'Motivo'
      })
    ).rejects.toThrow('Motorista é obrigatório.');
  });

  test('deve lançar erro se reason for vazio', async () => {
    await expect(
      service.startUsage({
        carId: baseCar.id,
        driverId: baseDriver.id,
        reason: '   '
      })
    ).rejects.toThrow('Motivo da utilização é obrigatório.');
  });

  test('deve lançar erro se carro não existir', async () => {
    carRepository.findById.mockResolvedValue(null);

    await expect(
      service.startUsage({
        carId: 'car-999',
        driverId: baseDriver.id,
        reason: 'Motivo'
      })
    ).rejects.toThrow('Automóvel não encontrado.');
  });

  test('deve lançar erro se motorista não existir', async () => {
    driverRepository.findById.mockResolvedValue(null);

    await expect(
      service.startUsage({
        carId: baseCar.id,
        driverId: 'driver-999',
        reason: 'Motivo'
      })
    ).rejects.toThrow('Motorista não encontrado.');
  });

  test('não deve permitir uso se carro já está em utilização ativa', async () => {
    carUsageRepository.findActiveByCarId.mockResolvedValue({
      id: 'usage-1',
      carId: baseCar.id,
      driverId: baseDriver.id
    });

    await expect(
      service.startUsage({
        carId: baseCar.id,
        driverId: baseDriver.id,
        reason: 'Outro uso'
      })
    ).rejects.toThrow('Este automóvel já está em utilização.');

    expect(carUsageRepository.create).not.toHaveBeenCalled();
  });

  test('não deve permitir uso se motorista já está em utilização ativa', async () => {
    carUsageRepository.findActiveByDriverId.mockResolvedValue({
      id: 'usage-1',
      carId: baseCar.id,
      driverId: baseDriver.id
    });

    await expect(
      service.startUsage({
        carId: baseCar.id,
        driverId: baseDriver.id,
        reason: 'Outro uso'
      })
    ).rejects.toThrow('Este motorista já está utilizando um automóvel.');

    expect(carUsageRepository.create).not.toHaveBeenCalled();
  });

  test('deve permitir nova utilização após finalizar a anterior', async () => {
    carUsageRepository.create.mockResolvedValueOnce({
      id: 'usage-1',
      carId: baseCar.id,
      driverId: baseDriver.id,
      startDate: new Date(),
      endDate: null,
      reason: 'Primeira utilização',
      createdAt: new Date()
    });

    carUsageRepository.findById.mockResolvedValueOnce({
      id: 'usage-1',
      startDate: new Date(),
      endDate: null,
      reason: 'Primeira utilização',
      createdAt: new Date(),
      car: baseCar,
      driver: baseDriver
    });

    carUsageRepository.finishUsage.mockResolvedValueOnce({
      id: 'usage-1',
      startDate: new Date(),
      endDate: new Date(),
      reason: 'Primeira utilização',
      createdAt: new Date(),
      car: baseCar,
      driver: baseDriver
    });

    const firstUsage = await service.startUsage({
      carId: baseCar.id,
      driverId: baseDriver.id,
      reason: 'Primeira utilização'
    });

    await service.finishUsage(firstUsage.id);

    carUsageRepository.findActiveByCarId.mockResolvedValue(null);
    carUsageRepository.findActiveByDriverId.mockResolvedValue(null);

    carUsageRepository.create.mockResolvedValueOnce({
      id: 'usage-2',
      carId: baseCar.id,
      driverId: baseDriver.id,
      startDate: new Date(),
      endDate: null,
      reason: 'Segunda utilização',
      createdAt: new Date()
    });

    const newUsage = await service.startUsage({
      carId: baseCar.id,
      driverId: baseDriver.id,
      reason: 'Segunda utilização'
    });

    expect(newUsage.id).toBe('usage-2');
  });

  test('deve lançar erro ao finalizar utilização inexistente', async () => {
    carUsageRepository.findById.mockResolvedValue(null);

    await expect(service.finishUsage('usage-999')).rejects.toThrow(
      'Utilização não encontrada.'
    );

    expect(carUsageRepository.finishUsage).not.toHaveBeenCalled();
  });

  test('deve lançar erro ao finalizar utilização já finalizada', async () => {
    const endedUsage = {
      id: 'usage-1',
      startDate: new Date(),
      endDate: new Date(),
      reason: 'Já finalizada',
      createdAt: new Date(),
      car: baseCar,
      driver: baseDriver
    };

    carUsageRepository.findById.mockResolvedValue(endedUsage);

    await expect(service.finishUsage('usage-1')).rejects.toThrow(
      'Utilização já foi finalizada.'
    );
  });

  test('deve listar todas as utilizações', async () => {
    carUsageRepository.listAll.mockResolvedValue([
      {
        id: 'usage-1',
        startDate: new Date(),
        endDate: null,
        reason: 'Uso 1',
        createdAt: new Date(),
        car: baseCar,
        driver: baseDriver
      },
      {
        id: 'usage-2',
        startDate: new Date(),
        endDate: new Date(),
        reason: 'Uso 2',
        createdAt: new Date(),
        car: baseCar,
        driver: baseDriver
      }
    ]);

    const result = await service.listUsages();

    expect(carUsageRepository.listAll).toHaveBeenCalled();
    expect(result).toHaveLength(2);
  });

  test('deve buscar utilização por id', async () => {
    const usage = {
      id: 'usage-1',
      startDate: new Date(),
      endDate: null,
      reason: 'Uso 1',
      createdAt: new Date(),
      car: baseCar,
      driver: baseDriver
    };

    carUsageRepository.findById.mockResolvedValue(usage);

    const result = await service.getUsageById('usage-1');

    expect(carUsageRepository.findById).toHaveBeenCalledWith('usage-1');
    expect(result.id).toBe('usage-1');
  });

  test('deve lançar erro ao buscar utilização inexistente', async () => {
    carUsageRepository.findById.mockResolvedValue(null);

    await expect(service.getUsageById('usage-999')).rejects.toThrow(
      'Utilização não encontrada.'
    );
  });
});
