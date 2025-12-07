import { EntitySchema } from 'typeorm';

export const DriverEntity = new EntitySchema({
  name: 'Driver',
  tableName: 'drivers',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid'
    },
    name: {
      type: 'varchar',
      length: 100,
      nullable: false
    },
    cpf: {
      type: 'varchar',
      length: 11,
      nullable: false,
      unique: true
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamp',
      createDate: true
    },
    updatedAt: {
      name: 'updated_at',
      type: 'timestamp',
      updateDate: true
    }
  },
  relations: {
    carUsages: {
      type: 'one-to-many',
      target: 'CarUsage',
      inverseSide: 'driver'
    }
  }
});
