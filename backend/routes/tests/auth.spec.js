const request = require('supertest');
const app = require('../../app');
const User = require('../../models/User');
const { hashPassword } = require('../../utils/bcrypt');
const { generateToken } = require('../../utils/jwt');

describe('Auth Endpoints', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  };

  const endpoint = '/api/v1/auth';

  describe(`POST ${endpoint}/signup`, () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post(`${endpoint}/signup`)
        .send(testUser);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message', 'User created');
    });

    it('should return 409 if user already exists', async () => {
      const hashedPassword = await hashPassword(testUser.password);
      await User.create({ ...testUser, password: hashedPassword });

      const res = await request(app)
        .post(`${endpoint}/signup`)
        .send(testUser);

      expect(res.statusCode).toEqual(409);
      expect(res.body).toHaveProperty('message', 'User already exists');
    });

    it('should validate request body', async () => {
      const res = await request(app)
        .post(`${endpoint}/signup`)
        .send({ name: '', email: 'invalid', password: '123' });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('errors');
    });
  });

  describe(`POST ${endpoint}/login`, () => {
    let hashedPassword;
    beforeEach(async () => {
      hashedPassword = await hashPassword(testUser.password);
      await User.create({ ...testUser, password: hashedPassword });
    });

    it('should login a user with valid credentials', async () => {
      const res = await request(app)
        .post(`${endpoint}/login`)
        .send({ email: testUser.email, password: testUser.password });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should return 404 for invalid email', async () => {
      const res = await request(app)
        .post(`${endpoint}/login`)
        .send({ email: 'nonexistent@example.com', password: testUser.password });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'User not found');
    });

    it('should return 404 for invalid password', async () => {
      const res = await request(app)
        .post(`${endpoint}/login`)
        .send({ email: testUser.email, password: 'wrongpassword' });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'User not found');
    });

    it('should validate request body', async () => {
      const res = await request(app)
        .post(`${endpoint}/login`)
        .send({ email: 'invalid', password: '123' });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('errors');
    });
  });

  describe(`GET ${endpoint}/verify`, () => {
    let token;

    beforeEach(async () => {
      const hashedPassword = await hashPassword(testUser.password);
      const user = await User.create({ ...testUser, password: hashedPassword });
      token = await generateToken({ id: user._id });
    });

    it('should verify a valid token', async () => {
      const res = await request(app)
        .get(`${endpoint}/verify`)
        .set('token', token);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Authorized');
    });

    it('should return 401 for missing token', async () => {
      const res = await request(app).get(`${endpoint}/verify`);

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Unauthorized');
    });

    it('should return 401 for invalid token', async () => {
      const res = await request(app)
        .get(`${endpoint}/verify`)
        .set('token', 'invalid-token');

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Unauthorized');
    });
  });
});