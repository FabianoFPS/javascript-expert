const { readFile } = require('fs/promises');
const { join } = require('path');
const { error } = require('./constantes');
const { User } = require('./user');

const DEFAULT_OPTION = {
  maxLines: 3,
  fields: ["id","name","profession","age"]
}

class File {
  static async csvToJson(filePtah) {
    const content = await File.getFileContent(filePtah);
    const validation = File.isvalid(content);

    if(!validation.valid) throw new Error(validation.error);

    const users = File.parseCSVToJson(content);
    
    return users;
  }

  static async getFileContent(filePtah) {
    // const fileName = join(__dirname, filePtah);
    // return (await readFile(fileName)).toString("utf-8");
    return (await readFile(filePtah)).toString("utf-8");
  }

  static isvalid(csvString, options = DEFAULT_OPTION) {
    const [header, ...fileWithoutHeader]= csvString.split('\n');

    const isHeaderValid = header === options.fields.join(',');

    if(!isHeaderValid) {
      return {
        error: error.FILE_FIELDS_ERROR_MESSAGE,
        valid: false
      };
    }

    const isContentLengthAccept = (
      fileWithoutHeader.length > 0 &&
      fileWithoutHeader.length <= options.maxLines
    )
    
    if(!isContentLengthAccept) {
      return {
        error: error.FILE_LENGTH_ERROR_MESSAGE,
        valid: false
      }
    }

    return { valid: true  }
  }

  static parseCSVToJson(csvString) {
    const lines = csvString.split('\n');
    const firstLine = lines.shift();
    const headers = firstLine.split(',');

    const users = lines.map( line => {
      const columns = line.split(',');
      let user = {};

      for(const index in columns) {
        user[headers[index]] = columns[index];
      }

      return new User(user);
    })

    return users;
  }
}

module.exports = File;