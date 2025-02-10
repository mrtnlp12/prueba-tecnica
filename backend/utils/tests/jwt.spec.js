const jwt = require('jsonwebtoken');
const { generateToken, verifyToken } = require('../jwt');

describe('JWT Utils', () => {
  const mockPayload = { id: '12345' };
  const mockSecret = 'test-secret';
  let token;

  beforeAll(() => {
    process.env.JWT_SECRET = mockSecret;
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', async () => {
      const mockToken = 'fake.jwt.token';
      jest.spyOn(jwt, 'sign').mockImplementation((payload, secret, options, callback) => {
        callback(null, mockToken);
      });

      token = await generateToken(mockPayload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string'); 

      jwt.sign.mockRestore();
    });

    it('should reject with an error if signing fails', async () => {
      jest.spyOn(jwt, 'sign').mockImplementation((payload, secret, options, callback) => {
        callback(new Error('Signing failed'), null);
      });

      await expect(generateToken(mockPayload)).rejects.toThrow('Signing failed');

      jwt.sign.mockRestore();
    });
  });

  describe('verifyToken', () => {
    beforeEach(async () => {
      token = await generateToken(mockPayload);
    });

    it('should verify a valid token and return the payload', async () => {
      const payload = await verifyToken(token);

      expect(payload).toBeDefined();
      expect(payload).toMatchObject(mockPayload);
    });

    it('should return null for an invalid token', async () => {
      const invalidToken = 'invalidtoken';

      const payload = await verifyToken(invalidToken);

      expect(payload).toBeNull();
    });

    it('should return null for an expired token', async () => {
      const expiredToken = jwt.sign(mockPayload, mockSecret, { expiresIn: '-1h' });

      const payload = await verifyToken(expiredToken);

      expect(payload).toBeNull();
    });
  });
});