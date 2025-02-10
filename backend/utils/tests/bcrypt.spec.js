const { hashPassword, validatePassword } = require('../bcrypt');

describe('Bcrypt Utils', () => {
  const plainPassword = 'aldocitalan';
  let hashedPassword;

  describe('hashPassword', () => {
    it('should hash a password correctly', async () => {
      hashedPassword = await hashPassword(plainPassword);

      expect(hashedPassword).toBeDefined();
      expect(typeof hashedPassword).toBe('string');
      expect(hashedPassword).not.toBe(plainPassword);
    });

    it('should generate different hashes for the same password', async () => {
      const hash1 = await hashPassword(plainPassword);
      const hash2 = await hashPassword(plainPassword);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('validatePassword', () => {
    beforeEach(async () => {
      hashedPassword = await hashPassword(plainPassword);
    });

    it('should return true for a valid password', async () => {
      const isValid = await validatePassword(plainPassword, hashedPassword);
      expect(isValid).toBe(true);
    });

    it('should return false for an invalid password', async () => {
      const isValid = await validatePassword('wrongPassword', hashedPassword);
      expect(isValid).toBe(false);
    });
  });
});