'use strict'

const { deepStrictEqual } = require('node:assert');
const assert = require('node:assert');

// Garantir semantica e segurança em objetos

// *** apply
const myObj = {
  add(myValue) {
    return this.arg1 + this.arg2 + myValue;
  }
}

assert.deepStrictEqual(myObj.add.apply({ arg1: 10, arg2: 20 }, [100]), 130);

// Um prolema que pode acontecer (raro)
// Function.prototype.apply = () => { throw new Error('Fake error', { cause: 'Testing'})};
// assert.throws(() => myObj.add.apply({}, []), {
//   name: 'TypeError',
//   message: 'Fake error'
// });

// Esse pode acontecer!
myObj.add.apply = function () { throw new TypeError("Oder Fake Error!") }
assert.throws(() => myObj.add.apply({}, []), {
  name: 'TypeError',
  message: 'Oder Fake Error!'
});

// Usando Reflect
const result = Reflect.apply(myObj.add, { arg1: 5, arg2: 2 }, [200]);
assert.deepStrictEqual(result, 207);

// *** defineProperty

// Questões semanticas
function MyDate() { };

// Tudo é Object, mas Object adicionando prop para uma function?
Object.defineProperty(MyDate, 'withObject', { value: () => 'Hey there.' });
assert.deepStrictEqual(MyDate.withObject(), 'Hey there.')

// agora faz mais sentido
Reflect.defineProperty(MyDate, 'withReflect', { value: () => 'Hey dude.' });
assert.deepStrictEqual(MyDate.withReflect(), 'Hey dude.');

// deleProperty
const withDelete = {user: 'Fabiano'};
// imperformático, evitar usar ao máximo
delete withDelete.user;
assert.deepStrictEqual(withDelete.hasOwnProperty('user'), false);

const withReflect = { '@User': '@fabiano'};
assert.deepStrictEqual(withReflect['@User'], '@fabiano');
Reflect.deleteProperty(withReflect, '@user');
assert.deepStrictEqual(withReflect.hasOwnProperty('@user'), false);

// Deveriamos fazer um get somente em instâncias de ferências. Dessa forma n'ao retorna erro.
assert.deepStrictEqual(1['PrimitiveNotHaveProperty'], undefined);
// Com Eeflect , uma excessão é lançada
assert.throws(() => Reflect.get(1, 'PrimitiveNotHaveProperty'), TypeError);

// has
assert.ok('propertyName' in { propertyName: 'Some value'});
assert.ok(Reflect.has({ oderPropertyName: 'More some values' }, 'oderPropertyName'));

// *** ownKeys
const user = Symbol('user');
const dataBaseUser = {
  id: 1,
  [Symbol.for('password')]: 123,
  [user]: '@fabiano'
};

// Com os metodos de Object, temos que fazer 2 requisições
const objectKey = [
  ...Object.getOwnPropertyNames(dataBaseUser),
  ...Object.getOwnPropertySymbols(dataBaseUser),
];

assert.deepStrictEqual(objectKey, [ 'id', Symbol.for('password'), user]);

// Com Reflect, só um método
assert.deepStrictEqual(
  Reflect.ownKeys(dataBaseUser),
  [ 'id', Symbol.for('password'), user],
)