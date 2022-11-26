const assert = require('node:assert');
const myMap = new Map();

const keyMap = Symbol('keyMap');
// podem ser qualquer coisa como chave
myMap
  .set(1, 'one')
  .set(`fabiano`, { text: "two" })
  .set(true, () => `hello`)
  .set(keyMap, ['value1', 'value2']);

const myMapWithConstructor = new Map([
  ['1', 'str1'],
  [1, 'num1'],
  [true, 'bool1'],
]);

// console.log(`myMap`, myMap);
assert.deepStrictEqual(myMap.get(keyMap)[1], 'value2');
assert.deepStrictEqual(myMap.get(1), 'one');
assert.deepStrictEqual(myMap.get('fabiano'), { text: "two" });
assert.deepStrictEqual(myMap.get(true)(), 'hello');

// Em objects a chave só pode ser string ou symbol (number é coergido a string)
const onlyReferenceWork = { id: 1 };
myMap.set(onlyReferenceWork, { name: 'Fabiano Stoffel' });

assert.deepStrictEqual(myMap.get(onlyReferenceWork), { name: 'Fabiano Stoffel' });

// utilitários
// - No Object seria Object.keys({a:1}).length
assert.deepStrictEqual(myMap.size, 5);

// para verificar se uma item exite no objeto
assert.deepStrictEqual(({ name: 'fabiano' }).hasOwnProperty('name'), true);
assert.deepStrictEqual(myMap.has(onlyReferenceWork), true);
assert.ok(myMap.has(onlyReferenceWork));

// para remover um item do objeto
// delete item.id
// imperformático para o javascript
assert.ok(myMap.delete(onlyReferenceWork));

// Não dá para iterar em Objects diretamente
// tem que transformar com Obeject.entries(item)
// const object1 = {
//   a: 'somestring',
//   b: 42
// };
// for (const [key, value] of Object.entries(object1)) {
//   console.log(`${key}: ${value}`);
// }
myMap.delete(keyMap);
assert.deepStrictEqual(
  JSON.stringify([...myMap]),
  JSON.stringify([
    [1, 'one'],
    ['fabiano', { text: 'two' }],
    [true, () => { }]
  ])
);

// for (const [key, value] of myMap) {
//   console.log({key, value});
// }

// Object é inseguro, pois dependendo do nome da chave, pode substiuir algum comportamento padrão
assert.ok(({}).toString() === '[object Object]');
assert.deepStrictEqual(({toString: () => 'Hey'}).toString(), 'Hey');

// Qualquer chave pode colidir, com as propiedades herdadas do objeto, como constructor, toString, valueOf etc

const actor = {
  name: 'Meneguel',
  toString: 'Queen of null'
};

myMap.set('actor', actor);

assert.ok(myMap.has('actor'));
assert.throws(() => myMap.get('actor').toString(), TypeError);

myMap.set('toString', () => 'Colidiu');

assert.deepStrictEqual((myMap.get('toString')()), 'Colidiu');
assert.deepStrictEqual((myMap.toString()), '[object Map]');

// Não dá para limpar um Object sem reassina-lo
myMap.clear()
assert.deepStrictEqual([...myMap], []);

// --- WeakMap
// Pode ser coletado após perder as referências
// usado em casos bem especifcos
// tem as maiorias maiorias dos beneficios do Map
// Mas náo é iterável
// só chaves de referência é que já conheça
// mais leve e preve leak de memória, pq depois que as instâncias saem da memória, tudo é limpo

const weakMap = new WeakMap();
const hero = {
  name: 'Flash'
};

weakMap.set('hero', hero);
weakMap.get('hero');
weakMap.delete('hero');
weakMap.has('hero');
