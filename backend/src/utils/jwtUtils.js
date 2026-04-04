const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  // If no env secret exists yet, use a fallback for local dev
  const secret = process.env.JWT_SECRET || 'fallback_development_secret_only';
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
  return jwt.sign({ id: userId, role }, secret, { expiresIn });
};

const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'fallback_development_secret_only';
  return jwt.verify(token, secret);
};

module.exports = { generateToken, verifyToken };
