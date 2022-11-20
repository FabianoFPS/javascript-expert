const { error } = require('./src/constantes');
const  File = require('./src/file');
const { rejects, deepEqual } = require('assert');

(async () => {
  {
    const filePtah = './mocks/emptyFile-invalid.csv';
    const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE)
    const result = File.csvToJson(filePtah);
    await rejects(result, rejection);
  }

  {
    const filePtah = './mocks/fourItems-invalid.csv';
    const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE)
    const result = File.csvToJson(filePtah);
    await rejects(result, rejection);
  }

  {
    const filePtah = './mocks/threeItems-valid.csv';
    const result = await File.csvToJson(filePtah);
    const expect = [
      {
        "name": "Erick Wendel",
        "id": 123,
        "profession": "Javascript instructor",
        "birthDay": 1995
      },
      {
        "name": "Xuxa da Silva",
        "id": 321,
        "profession": "Javascript Specialist",
        "birthDay": 1940
      },
      {
        "name": "Joãozinho",
        "id": 231,
        "profession": "java Developer",
        "birthDay": 1990
      }
    ];

    deepEqual(JSON.stringify(result), JSON.stringify(expect));
  }
})();