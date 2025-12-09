import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../../../src/app/app.js';
import { carUsageController } from '../../../src/app/presentation/http/controllers/CarUsageController.js';

describe('CarUsage HTTP Flow (integration with mocks)', () => {
  let mockService;

  beforeEach(() => {
    mockService = {
      startUsage: jest.fn(),
      finishUsage: jest.fn(),
      listUsages: jest.fn(),
      getUsageById: jest.fn()
    };

    // Injeta o serviço mockado no controller já registrado nas rotas
    carUsageController.service = mockService;
  });

  test('deve iniciar uma utilização com sucesso (POST /usages)', async () => {
    const usageResponse = {
      id: 'usage-1',
      carId: 'car-1',
      driverId: 'driver-1',
      reason: 'Visita a cliente',
      startDate: '2025-01-10T09:00:00.000Z',
      endDate: null,
      createdAt: '2025-01-10T08:59:00.000Z'
    };

    mockService.startUsage.mockResolvedValue(usageResponse);

    const res = await request(app)
      .post('/usages')
      .send({
        carId: 'car-1',
        driverId: 'driver-1',
        reason: 'Visita a cliente',
        startDate: '2025-01-10T09:00:00.000Z'
      })
      .expect(201);

    expect(mockService.startUsage).toHaveBeenCalledWith({
      carId: 'car-1',
      driverId: 'driver-1',
      reason: 'Visita a cliente',
      startDate: '2025-01-10T09:00:00.000Z'
    });

    expect(res.body).toEqual(usageResponse);
  });

  test('deve retornar 400 quando ocorrer erro ao iniciar utilização', async () => {
    mockService.startUsage.mockRejectedValue(
      new Error('Motivo da utilização é obrigatório.')
    );

    const res = await request(app)
      .post('/usages')
      .send({
        carId: 'car-1',
        driverId: 'driver-1',
        reason: '   '
      })
      .expect(400);

    expect(res.body).toEqual({
      error: 'Motivo da utilização é obrigatório.'
    });
  });

  test('deve finalizar uma utilização com sucesso (PATCH /usages/:id/finish)', async () => {
    const finishedUsage = {
      id: 'usage-1',
      carId: 'car-1',
      driverId: 'driver-1',
      reason: 'Visita a cliente',
      startDate: '2025-01-10T09:00:00.000Z',
      endDate: '2025-01-10T18:00:00.000Z',
      createdAt: '2025-01-10T08:59:00.000Z'
    };

    mockService.finishUsage.mockResolvedValue(finishedUsage);

    const res = await request(app)
      .patch('/usages/usage-1/finish')
      .send({
        endDate: '2025-01-10T18:00:00.000Z'
      })
      .expect(200);

    expect(mockService.finishUsage).toHaveBeenCalledWith(
      'usage-1',
      '2025-01-10T18:00:00.000Z'
    );

    expect(res.body).toEqual(finishedUsage);
  });

  test('deve listar utilizações com sucesso (GET /usages)', async () => {
    const usages = [
      {
        id: 'usage-1',
        reason: 'Visita a cliente',
        car: {
          id: 'car-1',
          plate: 'ABC1D23'
        },
        driver: {
          id: 'driver-1',
          name: 'João da Silva'
        },
        startDate: '2025-01-10T09:00:00.000Z',
        endDate: '2025-01-10T18:00:00.000Z',
        createdAt: '2025-01-10T08:59:00.000Z'
      }
    ];

    mockService.listUsages.mockResolvedValue(usages);

    const res = await request(app).get('/usages').expect(200);

    expect(mockService.listUsages).toHaveBeenCalledTimes(1);
    expect(res.body).toEqual(usages);
  });

  test('deve buscar utilização por id com sucesso (GET /usages/:id)', async () => {
    const usage = {
      id: 'usage-1',
      reason: 'Visita a cliente',
      car: {
        id: 'car-1',
        plate: 'ABC1D23'
      },
      driver: {
        id: 'driver-1',
        name: 'João da Silva'
      },
      startDate: '2025-01-10T09:00:00.000Z',
      endDate: '2025-01-10T18:00:00.000Z',
      createdAt: '2025-01-10T08:59:00.000Z'
    };

    mockService.getUsageById.mockResolvedValue(usage);

    const res = await request(app).get('/usages/usage-1').expect(200);

    expect(mockService.getUsageById).toHaveBeenCalledWith('usage-1');
    expect(res.body).toEqual(usage);
  });

  test('deve retornar 404 quando utilização não for encontrada (GET /usages/:id)', async () => {
    // Forçamos uma mensagem que ativa o branch de 404 no controller
    mockService.getUsageById.mockRejectedValue(
      new Error('Utilização Não encontrada.')
    );

    const res = await request(app).get('/usages/usage-999').expect(404);

    expect(mockService.getUsageById).toHaveBeenCalledWith('usage-999');
    expect(res.body).toEqual({
      error: 'Utilização Não encontrada.'
    });
  });
});
