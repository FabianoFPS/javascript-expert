'use strict';
const http = require('node:http');
const { join } = require('node:path');

const { CarService } = require('./service/carService');
const carsDatabase = join(__dirname, '../database', 'cars.json');

const STATUS_CODE = {
  OK: 200,
  INTERNAL_SERVER_ERROR: 500,
};

const DEFAULT_PORT = 3000;
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
}

const defaultFactory = () => ({
  carService: new CarService({ car: carsDatabase })
});

class Api {
  constructor(dependencies = defaultFactory()) {
    this.carService = dependencies.carService;
  }

  generateRoutes() {
    return {
      '/available-car:post': this.getAvailableCar.bind(this),
      '/renting_price:post': this.rentingPrice.bind(this),
      '/register_renting:post': this.registerRenting.bind(this),
      default: (request, response) => {
        response.write(JSON.stringify({ success: 'Hello World!' }))
        return response.end();
      }
    };
  }

  async registerRenting(request, response) {
    for await (const data of request) {
      try {
        const {
          customer,
          car_category: carCategory,
          days: numbersOfDays
        } = JSON.parse(data);

        const result = await this.carService.rent(
          customer,
          carCategory,
          numbersOfDays,
        );
        const { amount: finalPrice, dueDate } = result;

        response.writeHead(STATUS_CODE.OK, DEFAULT_HEADERS);
        response.write(JSON.stringify({
          finalPrice,
          dueDate
        }));
        response.end();

      } catch (error) {
        console.log({ error });
        response.writeHead(STATUS_CODE.INTERNAL_SERVER_ERROR, DEFAULT_HEADERS);
        response.write(JSON.stringify({ error }));
        response.end();
      }
    }
  }

  async rentingPrice(request, response) {
    for await (const data of request) {
      try {
        const {
          customer,
          car_category: carCategory,
          days: numbersOfDays
        } = JSON.parse(data);

        const result = this.carService.calculateFinalPrice(
          customer,
          carCategory,
          numbersOfDays,
        );

        const price = {
          price: result
        };

        response.writeHead(STATUS_CODE.OK, DEFAULT_HEADERS);
        response.write(JSON.stringify(price));
        response.end();

      } catch (error) {
        console.log({ error });
        response.writeHead(STATUS_CODE.INTERNAL_SERVER_ERROR, DEFAULT_HEADERS);
        response.write(JSON.stringify({ error }));
        response.end();
      }
    }
  }

  async getAvailableCar(request, response) {
    for await (const data of request) {
      try {
        const { car_category } = JSON.parse(data);
        const car = await this.carService.getAvailableCar(car_category);

        response.writeHead(STATUS_CODE.OK, DEFAULT_HEADERS);
        response.write(JSON.stringify(car));
        response.end();

      } catch (error) {
        console.log({ error });
        response.writeHead(STATUS_CODE.INTERNAL_SERVER_ERROR, DEFAULT_HEADERS);
        response.write(JSON.stringify({ error }));
        response.end();
      }
    }
  }

  handler(request, response) {
    const { url, method } = request;
    const routeKey = `${url}:${method.toLowerCase()}`;

    const routes = this.generateRoutes();
    const chosen = routes[routeKey] ?? routes.default;

    response.writeHead(STATUS_CODE.OK, DEFAULT_HEADERS);
    return chosen(request, response);
  }

  initialize(port = DEFAULT_PORT) {
    const app = http.createServer(this.handler.bind(this))
      .listen(port, _ => console.log(`app running at ${port}`));

    return app;
  }
}

if (process.env.NODE_ENV !== 'test') {
  const api = new Api();
  api.initialize();
}

const api = (dependencies) => new Api(dependencies)
module.exports = { api };
