const assert = require('node:assert');

const arr1 = ['0', '1', '2'];
const arr2 = ['2', '0', '3'];
const arr3 = arr1.concat(arr2);

assert.deepStrictEqual(arr3.sort(), [ '0', '0', '1', '2', '2', '3' ]);

const set = new Set();
arr1.map(item => set.add(item));
arr2.map(item => set.add(item));

assert.deepStrictEqual(Array.from(set), ['0', '1', '2', '3']);
assert.deepStrictEqual(Array.from(new Set([...arr1, ...arr2])), ['0', '1', '2', '3']);


assert.deepStrictEqual(set.keys(), set.values());

// no Array comum, para saber se um item eiste
// [].index('1') !== -1 ou [0].includes(0)
assert.ok(set.has('3'));

// mesma teoria do Map, mas você sempre trabalha com a lista toda
// náo tem get, então você pode saber se o item está ou não no array e é isso.
// na documentação tem exemplos sobre como fazer uma interceção, saber oque tem em uma lista e não tem na outra e assim por diante

const users01 = new Set([
  'fabiano',
  'mariazinha',
  'pierre'
]);

const users02 = new Set([
  'joaozinho',
  'fabiano',
  'julio'
]);

const intersection = [...users01].filter(user => users02.has(user) );
assert.deepStrictEqual(intersection, ['fabiano']);

const difference = [...users01].filter(user => !users02.has(user));
assert.deepStrictEqual(difference, ['mariazinha', 'pierre']);

// --- weakSet
// se mantem com valores que se mantem em memória
// só trabalha com chaves como referencia
// só tem metodos simples

const user = { id: 123 };
const user2 = { id: 123 };

const weakSet = new WeakSet([user]);
assert.deepStrictEqual(weakSet.has(user), true);
weakSet.add(user);
weakSet.delete(user);