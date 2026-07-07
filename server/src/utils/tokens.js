const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../config/env');

function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role, name: user.name },
    env.jwt.accessSecret,
    { expiresIn: env.jwt.accessExpires }
  );
}

function signRefreshToken(user) {
  return jwt.sign({ sub: user.id }, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpires,
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, env.jwt.accessSecret);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwt.refreshSecret);
}

// We only ever store a hash of the refresh token in the DB.
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// Convert a JWT expiry value to an absolute Date for the DB column.
function refreshExpiryDate() {
  const decoded = jwt.decode(
    jwt.sign({}, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpires })
  );
  return new Date(decoded.exp * 1000);
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashToken,
  refreshExpiryDate,
};
