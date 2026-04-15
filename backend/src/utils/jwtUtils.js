const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      return jwt.sign({ id: userId, role }, 'fallback_development_secret_only', {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
      });
    }
    throw new Error('JWT_SECRET is required in non-development environments');
  }
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
  return jwt.sign({ id: userId, role }, secret, { expiresIn });
};

const verifyToken = (token) => {
  const secret =
    process.env.JWT_SECRET ||
    (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
      ? 'fallback_development_secret_only'
      : null);
  if (!secret) {
    throw new Error('JWT_SECRET is required in non-development environments');
  }
  return jwt.verify(token, secret);
};

module.exports = { generateToken, verifyToken };
