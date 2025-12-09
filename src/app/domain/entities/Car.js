export class Car {
  constructor({ id, plate, color, brand, createdAt, updatedAt }) {
    this.id = id;
    this.plate = plate;
    this.color = color;
    this.brand = brand;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toJSON() {
    return {
      id: this.id,
      plate: this.plate,
      color: this.color,
      brand: this.brand,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
