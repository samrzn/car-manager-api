import { jest } from '@jest/globals';
import { CarService } from '../../../../app/domain/services/CarService.js';

describe('CarService', () => {
  let carRepository;
  let service;

  beforeEach(() => {
    carRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByPlate: jest.fn(),
      findAll: jest.fn(),
      findByFilters: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };

    service = new CarService(carRepository);
  });

  test('deve criar automóvel com placa normalizada em maiúsculas', async () => {
    carRepository.findByPlate.mockResolvedValue(null);
    carRepository.create.mockResolvedValue({
      id: '1',
      plate: 'ABC1D23',
      color: 'Prata',
      brand: 'Fiat'
    });

    const car = await service.createCar({
      plate: 'abc1d23',
      color: 'Prata',
      brand: 'Fiat'
    });

    expect(carRepository.findByPlate).toHaveBeenCalledWith('ABC1D23');
    expect(carRepository.create).toHaveBeenCalledWith({
      plate: 'ABC1D23',
      color: 'Prata',
      brand: 'Fiat'
    });
    expect(car.plate).toBe('ABC1D23');
  });

  test('deve lançar erro se placa estiver vazia', async () => {
    await expect(
      service.createCar({ plate: '   ', color: 'Prata', brand: 'Fiat' })
    ).rejects.toThrow('Placa do automóvel é obrigatória.');
    expect(carRepository.create).not.toHaveBeenCalled();
  });

  test('deve lançar erro se cor estiver vazia', async () => {
    await expect(
      service.createCar({ plate: 'ABC1D23', color: '   ', brand: 'Fiat' })
    ).rejects.toThrow('Cor do automóvel é obrigatória.');
  });

  test('deve lançar erro se marca estiver vazia', async () => {
    await expect(
      service.createCar({ plate: 'ABC1D23', color: 'Prata', brand: '   ' })
    ).rejects.toThrow('Marca do automóvel é obrigatória.');
  });

  test('não deve permitir duas placas iguais', async () => {
    carRepository.findByPlate.mockResolvedValue({
      id: '1',
      plate: 'ABC1D23'
    });

    await expect(
      service.createCar({
        plate: 'abc1d23',
        color: 'Preto',
        brand: 'Ford'
      })
    ).rejects.toThrow('Já existe um automóvel com esta placa.');

    expect(carRepository.create).not.toHaveBeenCalled();
  });

  test('deve atualizar dados do automóvel', async () => {
    const existing = {
      id: '1',
      plate: 'ABC1D23',
      color: 'Prata',
      brand: 'Fiat'
    };

    carRepository.findById.mockResolvedValue(existing);
    carRepository.findByPlate.mockResolvedValue(null);
    carRepository.update.mockImplementation(async (car) => car);

    const updated = await service.updateCar('1', {
      plate: 'XYZ9Z99',
      color: 'Preto',
      brand: 'Ford'
    });

    expect(carRepository.findById).toHaveBeenCalledWith('1');
    expect(carRepository.findByPlate).toHaveBeenCalledWith('XYZ9Z99');
    expect(carRepository.update).toHaveBeenCalled();
    expect(updated.plate).toBe('XYZ9Z99');
    expect(updated.color).toBe('Preto');
  });

  test('não deve permitir atualização para placa já existente em outro carro', async () => {
    carRepository.findById.mockResolvedValue({
      id: '1',
      plate: 'ABC1D23',
      color: 'Prata',
      brand: 'Fiat'
    });

    carRepository.findByPlate.mockResolvedValue({
      id: '2',
      plate: 'XYZ9Z99',
      color: 'Preto',
      brand: 'Ford'
    });

    await expect(service.updateCar('1', { plate: 'xyz9z99' })).rejects.toThrow(
      'Já existe um automóvel com esta placa.'
    );

    expect(carRepository.update).not.toHaveBeenCalled();
  });

  test('deve lançar erro ao atualizar carro inexistente', async () => {
    carRepository.findById.mockResolvedValue(null);

    await expect(
      service.updateCar('999', { plate: 'ABC1D23' })
    ).rejects.toThrow('Automóvel não encontrado.');
  });

  test('deve buscar automóvel por id', async () => {
    carRepository.findById.mockResolvedValue({
      id: '1',
      plate: 'ABC1D23',
      color: 'Prata',
      brand: 'Fiat'
    });

    const car = await service.getCarById('1');

    expect(carRepository.findById).toHaveBeenCalledWith('1');
    expect(car.id).toBe('1');
  });

  test('deve lançar erro ao buscar automóvel inexistente', async () => {
    carRepository.findById.mockResolvedValue(null);

    await expect(service.getCarById('999')).rejects.toThrow(
      'Automóvel não encontrado.'
    );
  });

  test('deve listar todos automóveis quando nenhum filtro é passado', async () => {
    carRepository.findAll.mockResolvedValue([
      { id: '1', plate: 'ABC1D23', color: 'Prata', brand: 'Fiat' },
      { id: '2', plate: 'XYZ9Z99', color: 'Preto', brand: 'Ford' }
    ]);

    const cars = await service.listCars({});

    expect(carRepository.findAll).toHaveBeenCalled();
    expect(cars).toHaveLength(2);
  });

  test('deve filtrar automóveis por cor e marca', async () => {
    carRepository.findByFilters.mockResolvedValue([
      { id: '1', plate: 'ABC1D23', color: 'Prata', brand: 'Fiat' }
    ]);

    const cars = await service.listCars({ color: 'Prata', brand: 'Fiat' });

    expect(carRepository.findByFilters).toHaveBeenCalledWith({
      color: 'Prata',
      brand: 'Fiat'
    });
    expect(cars).toHaveLength(1);
    expect(cars[0].plate).toBe('ABC1D23');
  });

  test('deve deletar automóvel existente', async () => {
    carRepository.findById.mockResolvedValue({
      id: '1',
      plate: 'ABC1D23'
    });
    carRepository.delete.mockResolvedValue(true);

    await service.deleteCar('1');

    expect(carRepository.findById).toHaveBeenCalledWith('1');
    expect(carRepository.delete).toHaveBeenCalledWith('1');
  });

  test('deve lançar erro ao deletar automóvel inexistente', async () => {
    carRepository.findById.mockResolvedValue(null);

    await expect(service.deleteCar('999')).rejects.toThrow(
      'Automóvel não encontrado.'
    );
  });
});
