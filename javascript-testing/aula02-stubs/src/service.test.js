const sinon = require('sinon');
const { deepStrictEqual } = require('assert');

const { Service } = require('./service');

const BASE_URL_1 = 'https://swapi.dev/api/planets/1';
const BASE_URL_2 = 'https://swapi.dev/api/planets/2';
const mocks = {
  tatooine: require('./mocks/tatooine.json'),
  alderaan: require('./mocks/alderaan.json')
};

( async () => {
  // {
  //   const withoutStub = await new Service().makeRequest(BASE_URL_2);
  //   console.log(JSON.stringify(withoutStub));
  // }

  const service = new Service();
  const stub = sinon.stub(service, service.makeRequest.name);

  stub
    .withArgs(BASE_URL_1)
    .resolves(mocks.tatooine);

  stub
    .withArgs(BASE_URL_2)
    .resolves(mocks.alderaan);

  // {
  //   const response = await service.makeRequest(BASE_URL_1);
  //   console.log('response', response);
  // }

  {
    const expected = {
      name: "Tatooine",
      surface_water: '1',
      appearedIn: 5
    }

    const result = await service.getPlanets(BASE_URL_1);
    deepStrictEqual(result, expected);
  }
  
  {
    const expected = {
      name: "Alderaan",
      surface_water: '40',
      appearedIn: 2
    }
    
    const result = await service.getPlanets(BASE_URL_2);
    deepStrictEqual(result, expected);
  }

})()