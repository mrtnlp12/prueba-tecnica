const request = require('supertest');
const app = require('../../app');

describe('User routes', () => {
  const endpoint = '/api/v1/users';

  describe(`GET ${endpoint}`, () => {

    it('should return all users', async () => {
      const res = await request(app)
        .get(endpoint);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
    });
  });
});