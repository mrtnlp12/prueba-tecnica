const { validatePassword, hashPassword } = require("../utils/bcrypt");
const { generateToken, verifyToken} = require("../utils/jwt");
const UserService = require("../services/userService");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserService.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await validatePassword(password, user.password);

    if (!isPasswordValid) {
      // Mensaje genérico para evitar dar pistas a un atacante
      return res.status(404).json({ message: 'User not found' });
    }

    const token = await generateToken({ id: user._id });


    res.status(200).json({
      token
    });

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await UserService.getUserByEmail(email);

    if (user) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await hashPassword(password);

    await UserService.registerUser(name, email, hashedPassword);
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

const checkAuth = async (req, res) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    res.status(200).json({ message: 'Authorized' });

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = {
  login,
  register,
  checkAuth
};