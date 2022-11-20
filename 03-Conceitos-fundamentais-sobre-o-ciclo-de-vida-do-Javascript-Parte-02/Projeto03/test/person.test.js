import { describe, it } from 'mocha';
import { expect } from "chai";

import { Person } from "../src/person.js";
import { TerminalController } from "../src/terminalController.js";
import { mainLoop } from "../src/index.js";

describe('Person', () => {
  it('should return a person instance from a string', () => {
    const person = Person.generateInstanceFromString(
      '1 Bike,Car 20000 2020-01-01 2020-02-01'
    );

    const expected = {
      id: '1',
      vehicles: ['Bike', 'Car'],
      kmTraveled: '20000',
      from: '2020-01-01',
      to: '2020-02-01'
    };

    expect(person).to.be.deep.equal(expected);
  });
  
  it('should format values', () => {
    const person = new Person({
      id: '1',
      vehicles: ['Bike', 'Car'],
      kmTraveled: '20000',
      from: '2020-01-01',
      to: '2020-02-01'
    });
    const result = person.formatted('pt-br');
    const expected = {
      id: 1,
      vehicles: 'Bike e Car',
      kmTraveled: '20.000 km',
      from: '01 de janeiro de 2020',
      to: '01 de fevereiro de 2020'
    };
    
    expect(result).to.be.deep.equal(expected);
  });
})
