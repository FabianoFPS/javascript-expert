const { faker } = require('@faker-js/faker');
const { randomUUID } = require('node:crypto');
const { join } = require('node:path');
const { writeFile } = require('node:fs/promises');

const { Car } = require('../src/entities/car');
const { Customer } = require('../src/entities/customer');
const { CarCategory } = require('../src/entities/carCategory');

const seederBaseFolder = join(__dirname, '../', 'database');
const ITEMS_AMOUNT = 2;

const carCategory = new CarCategory({
  id: randomUUID(),
  name: faker.vehicle.type(),
  carIds: [],
  price: faker.finance.amount(20, 100),
});

const cars = [];
const customers = [];
for (let index = 0; index <= ITEMS_AMOUNT; index++) {
  const car = new Car({
    id: randomUUID(),
    name: faker.vehicle.model(),
    available: true,
    gasAvailable: true,
    releaseYear: faker.date.past(5).getFullYear(),
  });

  carCategory.carIds.push(car.id);
  cars.push(car);

  const customer = new Customer({
    id: randomUUID(),
    name: faker.name.fullName(),
    age: faker.random.numeric(2),
  });

  customers.push(customer);
};

const write = (filename, data) => writeFile(
  join(seederBaseFolder, filename),
  JSON.stringify(data)
);

(async () => {
  await write('cars.json', cars);
  await write('carCategories.json', [carCategory]);
  await write('customers.json', customers);
})();



