const { BaseRepository } = require('../repository/base/baseRepository');

class CarService {
  constructor({ car }) {
    this.carRepository = new BaseRepository({ file: car });
  }
  
  getRandomPositionFromArray(list) {
    return Math.floor(Math.random() * list.length);
  }
  
  chooseRandomCar(carCategory) {
    const randomCarIdIndex = this.getRandomPositionFromArray(
      carCategory.carIds
      );
      return carCategory.carIds[randomCarIdIndex];
    }

    async getAvailableCar(carCategory) {
      const carId = this.chooseRandomCar(carCategory);
      return this.carRepository.find(carId);
    }
}

module.exports = { CarService }