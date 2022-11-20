import DraftLog from 'draftlog';
import chalk from "chalk";
import chalkTable from "chalk-table";
import readline from "node:readline";

import database from '../database.json';
import { Person } from './person.js';

DraftLog(console).addLineListener(process.stdin);
const DEFAULT_LANG = 'pt-br';
const options = {
  leftPad: 2,
  columns: [
    { field: "id", name: chalk.cyan("Id")},
    { field: "vehicles", name: chalk.magenta("Vehicles")},
    { field: "kmTraveled", name: chalk.cyan("KmTraveled")},
    { field: "from", name: chalk.cyan("From")},
    { field: "to", name: chalk.cyan("To")},
  ]
};

const table = chalkTable(options, database.map(item => new Person(item).formatted(DEFAULT_LANG)));
const print = console.draft(table);
// setInterval(() => {
//   database.push({
//     id: Date.now(),
//     vehicles: ['Test'+ Date.now()]
//   });
//   const table = chalkTable(options, database);
//   print(table);
// }, 400);

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

terminal.question('What is yor name? ', msg => console.log('msg', msg.toString()));