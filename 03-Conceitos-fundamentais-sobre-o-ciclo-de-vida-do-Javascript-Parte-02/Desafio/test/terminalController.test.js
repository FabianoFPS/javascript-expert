import { describe, it } from 'mocha';
import { expect } from "chai";
import chalk from "chalk";

import  readline  from 'node:readline'
import { Person } from "../src/person.js";
import { TerminalController } from "../src/terminalController.js";
import database from '../database.json';

describe('TerminalController', () => {
  it('getTableOptions', () =>{
    const terminalController = new TerminalController();
    const result = terminalController.getTableOptions();

    const expected = {
      leftPad: 2,
      columns: [
        { field: "id", name: chalk.cyan("Id") },
        { field: "vehicles", name: chalk.magenta("Vehicles") },
        { field: "kmTraveled", name: chalk.cyan("KmTraveled") },
        { field: "from", name: chalk.cyan("From") },
        { field: "to", name: chalk.cyan("To") },
      ]
    }

    expect(result).to.be.deep.equal(expected);
  });
})
