const { describe, it } = require('mocha');
const request = require('supertest');
const assert = require('node:assert');

const { app } = require('./api');

describe('API Suite test', () => {
  describe('/contact', () => {
    it('should request the contact page and return HTTP Status 2000', async () => {
      const response = await request(app)
        .get('/contact')
        .expect(200);

      assert.deepStrictEqual(response.text, 'contact us page\n');
    });
    
  });
  
  describe('/hello', () => {
    it('should request an inexistent route /hi and redirect to /hello', async () => {
      const response = await request(app)
        .get('/hello')
        .expect(200);

      assert.deepStrictEqual(response.text, 'Hello Word!\n');
    });
  });
  
  describe('/login', () => {
    it('should request an inexistent route /hi and redirect to /hello', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          username: 'fabiano',
          password: 'abc123'
        })
        .expect(200);

      assert.deepStrictEqual(response.text, 'Logging has succeeded\n');
    });
    
    it('should unauthorize a request when requesting it using credentials and return HTTP Status 401', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          username: 'unauthorizeUser',
          password: 'passwordWrong'
        })
        .expect(401);
      assert.ok(response.unauthorized);
      assert.deepStrictEqual(response.text, 'Logging failed');
    });
  });
})