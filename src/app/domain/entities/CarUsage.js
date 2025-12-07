export class CarUsage {
  constructor({ id, carId, driverId, startDate, endDate, reason, createdAt }) {
    this.id = id;
    this.carId = carId;
    this.driverId = driverId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.reason = reason;
    this.createdAt = createdAt;
  }

  isActive() {
    return !this.endDate;
  }
}
