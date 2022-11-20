const { BaseRepository } = require('../repository/base/baseRepository');
const { Tax } = require('../entities/tax');
const { Transaction } = require('../entities/transaction');

class CarService {
  constructor({ car }) {
    this.carRepository = new BaseRepository({ file: car });
    this.taxesBasedOnAge = Tax.taxesBasedOnAge
    this.currencyFormat = new Intl.NumberFormat('pt-br', {
      style: 'currency',
      currency: 'BRL',
    });
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

  calculateFinalPrice(
    customer,
    carCategory,
    numberOfDays,
  ) {
    const { age } = customer;
    const { price } = carCategory;
    const { then: tax } = this.taxesBasedOnAge
      .find(tax => age >= tax.from && age <= tax.to);

    const finalPrice = ((tax * price) * numberOfDays);
    const formattedPice = this.currencyFormat.format(finalPrice);

    return formattedPice;
  }

  async rent(
    customer,
    carCategory,
    numbersOfDays,
  )
  {
    const car = await this.getAvailableCar(carCategory);
    const finalPrice = this.calculateFinalPrice(customer, carCategory, numbersOfDays);
    
    const today = new Date();
    today.setDate(today.getDate() + numbersOfDays);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const Brazil = 'pt-br';
    const dueDate = today.toLocaleDateString(Brazil, options);

    const transaction = new Transaction({
      customer,
      dueDate,
      car,
      amount: finalPrice,
    });

    return transaction;
  }
}

module.exports = { CarService }