'use strict'

const Event = require('node:events');

const event = new Event();
const eventName = 'counter';

event.on(eventName, msg => console.log(`Counter updated ${JSON.stringify(msg)}`));

// event.emit(eventName, 'hello');
// event.emit(eventName, 'By');

const myCounter = {
  counter: 0,
  customTarget: 10e12
};

const proxy = new Proxy(
  myCounter,
  {
    set: (target, propertyKey, newValue) => {
      event.emit(
        eventName,
        {
          newValue,
          key: target[propertyKey],
        }
      );
    target[propertyKey] = newValue;
    return true;
    },

    get: (object, prop, _receiver) => {
      // console.log(`Called`, {object, prop});
      return object[prop];
    }
  }
);
const interval = 200;
setInterval(function () {
  proxy.counter += 1;
  proxy.customTarget -= 100;
  console.log('[3] setInterval');
  if(proxy.counter === 10) clearInterval(this);
}, interval);

// futuro
setTimeout(() => {
  proxy.counter = 4;
  console.log('[2] timeout');
}, 100)

// E quer que execute agora
setImmediate(() => {
  console.log(`[1]: setImmediate ${proxy.counter}`);
})

// Executa agora, mas acaba com o ciclo de vida do node [Má prática]
process.nextTick(() => {
  proxy.counter = 2;
  console.log('[0]: nextTick');
})