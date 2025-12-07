import { EntitySchema } from 'typeorm';

export const CarEntity = new EntitySchema({
  name: 'Car',
  tableName: 'cars',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid'
    },
    plate: {
      type: 'varchar',
      length: 10,
      nullable: false,
      unique: true
    },
    color: {
      type: 'varchar',
      length: 30,
      nullable: false
    },
    brand: {
      type: 'varchar',
      length: 50,
      nullable: false
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
      inverseSide: 'car'
    }
  }
});
