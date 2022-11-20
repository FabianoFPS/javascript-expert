const https = require('https');

class Service {
  async makeRequest(url) {
    return new Promise ((resolve, reject) => {
      https.get(url, response => {
        response.on('data', data => resolve(JSON.parse(data)));
        response.on('error', reject);
      })
    })
  }

  async getPlanets(url) {
    const result = await this.makeRequest(url);

    const { name, surface_water, films } = result;
    
    return {
      name,
      surface_water,
      appearedIn: films.length
    }
  }
}

module.exports = { Service };