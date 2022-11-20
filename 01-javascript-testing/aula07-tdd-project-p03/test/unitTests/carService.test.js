const { describe, it, before, beforeEach, afterEach } = require('mocha');
const { join } = require('node:path');
const { expect } = require('chai');
const sinon = require('sinon');

const { CarService } = require('../../src/service/carService');
const { Transaction } = require('../../src/entities/transaction');

const carsDatabase = join(__dirname, '../../database', 'cars.json');

const mocks = {
  validCarCategory: require('../mocks/valid-carCategory.json'),
  validCar: require('../mocks/valid-car.json'),
  validCustomer: require('../mocks/valid-customer.json'),
}

describe('CarService Suite Tests', () => {
  let carService = {};
  let sandbox = {};

  before(() => {
    carService = new CarService({ car: carsDatabase });
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should retrieve a random position from ann array', () => {
    const data = [0, 1, 2, 3, 4];
    const result = carService.getRandomPositionFromArray(data);

    expect(result).to.be.lte(data.length).and.be.gte(0);
  })

  it('should choose the first id from carTds in CarCategory', () => {
    const carCategory = mocks.validCarCategory;
    const carIndex = 0;

    sandbox.stub(
      carService,
      carService.getRandomPositionFromArray.name
    ).returns(carIndex);

    const result = carService.chooseRandomCar(carCategory);
    const expected = carCategory.carIds[carIndex];

    expect(carService.getRandomPositionFromArray.calledOnce).to.be.ok;
    expect(result).to.be.equal(expected);
  })

  it('given a carCategory it should return an available car', async () => {
    const car = mocks.validCar;
    const carCategory = Object.create(mocks.validCarCategory);
    carCategory.carIds = [car.id];

    sandbox.stub(
      carService.carRepository,
      carService.carRepository.find.name
    ).resolves(car);

    sandbox.spy(
      carService,
      carService.chooseRandomCar.name
    );

    const result = await carService.getAvailableCar(carCategory);
    const expected = car;

    expect(carService.chooseRandomCar.calledOnce).to.be.ok;
    expect(carService.carRepository.find.calledWithExactly(car.id)).to.be.ok;
    expect(result).to.be.deep.equal(expected);
  });

  it('give a carCategory, customer and numberOfDays it should calculate final amount in real', () => {
    const customer = Object.create(mocks.validCustomer);
    customer.age = 50;

    const carCategory = Object.create(mocks.validCarCategory);
    carCategory.price = 37.6;

    const numberOfDays = 5;

    // para não depender de dados externos
    sandbox.stub(
      carService,
      'taxesBasedOnAge'
      ).get(() => [{
        from: 31, 
        to: 100, 
        then: 1.3 
      }]);

    const expected = carService.currencyFormat.format(244.40);
    const result = carService.calculateFinalPrice(
      customer,
      carCategory,
      numberOfDays,
    );

    expect(result).to.be.deep.equal(expected);
  });

  it('given a customer and car category it should return a transaction receipt', async () => {
    const car = mocks.validCar;
    const carCategory = {
      ...mocks.validCarCategory,
      price: 37.6,
      carIds: [car.id]
    };
    const customer = Object.create(mocks.validCustomer);
    // console.log(customer.__proto__);
    customer.age = 20;
    const numbersOfDays = 5;
    const dueDate = '10 de novembro de 2020';
    const now = new Date(2020, 10, 5);
    sandbox.useFakeTimers(now.getTime());
    sandbox.stub(
      carService.carRepository,
      carService.carRepository.find.name,
    ).resolves(car);

    // age: 20, tax: 1.1, categoryPrice: 37.6
    // 37.6 * 1.1 = 41.36 * 5 days = 206.8

    const expectedAmount = carService.currencyFormat.format(206.8);
    const result = await carService.rent(
      customer,
      carCategory,
      numbersOfDays,
    );
    
    const expected = new Transaction({
      customer,
      car,
      dueDate,
      amount: expectedAmount,
    });

    expect(result).to.be.deep.equal(expected);
  })

});