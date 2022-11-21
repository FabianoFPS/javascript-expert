const assert = require('node:assert');

// --- keys
const uniqueKey = Symbol('userName');
const user = {};

user['userName'] = 'value for normalObjects';
user[uniqueKey] = 'value for symbol';

// console.log(user);
// console.log(user[Symbol('user')]);
// console.log(user[uniqueKey]);
// console.log(uniqueKey);

assert.deepStrictEqual(user.userName, 'value for normalObjects');
assert.deepStrictEqual(user[Symbol('userName')], undefined);
assert.deepStrictEqual(user[uniqueKey], 'value for symbol');

// Dificil de pegar, mas não é secreto!
assert.deepStrictEqual(Object.getOwnPropertySymbols(user)[0], uniqueKey);

// byPass - má prátrica (nem tem no codebase do node)
user[Symbol.for('password')] = 123;
assert.deepStrictEqual(user[Symbol.for('password')], 123);

// well known Symbols
const obj = {
  // iterators
  [Symbol.iterator]: () => {
    return {
      items: ['c', 'b', 'a'],
      next() {
        return {
          done: this.items.length === 0,
          // remove o ultimo e retorna
          value: this.items.pop()
        }
      }
    }
  }
}

// for(const item of obj) {
//   console.log(item)
// }

assert.deepStrictEqual([...obj], ['a', 'b', 'c']);

const kItems = Symbol('kItems');
class MyDate {
  constructor(...args) {
    this[kItems] = args.map(arg => new Date(...arg));
  }

  [Symbol.toPrimitive](coercionType) {
    if (coercionType !== 'string') throw new TypeError();

    const items = this[kItems].map(
      item => new Intl.DateTimeFormat('pt-br', {
        month: 'long',
        day: '2-digit',
        year: 'numeric',
      }).format(item)
    );

    return new Intl.ListFormat('pt-br', {
      style: 'long',
      type: 'conjunction',
    }).format(items);
  }

  *[Symbol.iterator]() {
    for (const item of this[kItems]) {
      yield item;
    }
  }

  async *[Symbol.asyncIterator]() {
    const timeout = ms => new Promise(r => setTimeout(r, ms));
    for (const item of this[kItems]) {
      await timeout(100);
      yield item.toString();
    }
  }

  get [Symbol.toStringTag]() {
    return 'WHAT?'
  }
}

const myDate = new MyDate(
  [2020, 03, 01],
  [2018, 02, 02]
);

const expectedDates = [
  new Date(2020, 03, 01),
  new Date(2018, 02, 02),
]

// console.assert(myDate[kItems] = expectedDates);
// console.log(myDate[kItems], expectedDates);

assert.deepStrictEqual(Object.prototype.toString.call(myDate), '[object WHAT?]');
assert.throws(() => myDate + 1, TypeError);
assert.deepStrictEqual(String(myDate), '01 de abril de 2020 e 02 de março de 2018');
assert.deepStrictEqual([...myDate], expectedDates);

// (async () => {
//   for await(const item of myDate) {
//     console.log('asyncIterator', item);
//   }
// })();

(async () => {
  const dates = await Promise.all([...myDate]);
  assert.deepStrictEqual(dates, expectedDates);
})