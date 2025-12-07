import { EntitySchema } from 'typeorm';

export const CarUsageEntity = new EntitySchema({
  name: 'CarUsage',
  tableName: 'car_usages',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid'
    },
    startDate: {
      name: 'start_date',
      type: 'timestamp',
      nullable: false
    },
    endDate: {
      name: 'end_date',
      type: 'timestamp',
      nullable: true
    },
    reason: {
      type: 'text',
      nullable: false
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamp',
      createDate: true
    }
  },
  relations: {
    car: {
      type: 'many-to-one',
      target: 'Car',
      joinColumn: {
        name: 'car_id'
      },
      nullable: false
    },
    driver: {
      type: 'many-to-one',
      target: 'Driver',
      joinColumn: {
        name: 'driver_id'
      },
      nullable: false
    }
  }
});
