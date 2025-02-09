
const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        reject(err);
      }
      resolve(token);
    });
  });
}

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        resolve(null);
      }
      resolve(payload);
    });
  })
}

module.exports = {
  generateToken,
  verifyToken
}