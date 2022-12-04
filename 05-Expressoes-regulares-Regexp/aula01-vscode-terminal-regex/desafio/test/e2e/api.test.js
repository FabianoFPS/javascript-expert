'use strict';
const { describe, it, skip, before, beforeEach, afterEach } = require('mocha');
const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const { join } = require('node:path');

const { CarService } = require('../../src/service/carService');

const carsDatabase = join(__dirname, '../../database', 'cars.json');

const mocks = {
  validCarCategory: require('../mocks/valid-carCategory.json'),
  validCar: require('../mocks/valid-car.json'),
  validCustomer: require('../mocks/valid-customer.json'),
}

const SERVER_TEST_PORT = 4000

describe('Renting a car', () => {
  let sandbox = {};
  let app = {};

  before(() => {
    const { api } = require('../../src/api');
    const carService = new CarService({ car: carsDatabase });
    const instance = api({ carService });
    app = {
      instance,
      server: instance.initialize(SERVER_TEST_PORT)
    }
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('In order to get an available car in a specific category', async () => {
    const car_category = Object.create(mocks.validCarCategory);
    car_category.carIds = ['7710cef9-f9ae-4b35-9f87-7f327c8d4e64'];

    const response = await request(app.server)
      .post('/available-car')
      .send({ car_category })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    const expected = JSON.stringify(mocks.validCar);
    expect(response.text).to.be.equal(expected);
  });

  it('Renting price', async () => {
    const carCategory = Object.create(mocks.validCarCategory);
    carCategory.price = 37.6;

    const customer = Object.create(mocks.validCustomer);
    customer.age = 50;

    const response = await request(app.server)
      .post('/renting_price')
      .send({
        car_category: carCategory,
        customer,
        days: 5
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    const price = Intl.NumberFormat('pt-br', {
      style: 'currency',
      currency: 'BRL',
    }).format(244.40);

    const expectedPrice = {
      price
    }
    expect(response.text).to.be.equal(JSON.stringify(expectedPrice));
  });

  it('Register a renting', async () => {
    // const carCategory = Object.create(mocks.validCarCategory);
    const carCategory = {
      ...mocks.validCarCategory,
      price: 37.6
    };
    // carCategory.price = 37.6;

    const customer = Object.create(mocks.validCustomer);
    customer.age = 50;

    const now = new Date(2020, 10, 5);
    sandbox.useFakeTimers(now.getTime());

    const response = await request(app.server)
      .post('/register_renting')
      .send({
        car_category: carCategory,
        customer,
        days: 5
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    const finalPrice = Intl.NumberFormat('pt-br', {
      style: 'currency',
      currency: 'BRL',
    }).format(244.40);

    const dueDate = '10 de novembro de 2020';

    const expected = {
      finalPrice,
      dueDate
    }
    expect(response.text).to.be.equal(JSON.stringify(expected));
  });
});