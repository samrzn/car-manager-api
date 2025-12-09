export class Driver {
  constructor({ id, name, cpf, createdAt, updatedAt }) {
    this.id = id;
    this.name = name;
    this.cpf = cpf;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      cpf: this.cpf,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
