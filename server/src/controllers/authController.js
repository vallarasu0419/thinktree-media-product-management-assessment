const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const { asyncHandler, ok, ApiError } = require('../utils/helpers');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
  refreshExpiryDate,
} = require('../utils/tokens');

function publicUser(u) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    is_active: u.is_active,
    last_login_at: u.last_login_at,
  };
}

async function issueTokens(user, req) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at, user_agent, ip_address)
     VALUES (?, ?, ?, ?, ?)`,
    [
      user.id,
      hashToken(refreshToken),
      refreshExpiryDate(),
      (req.headers['user-agent'] || '').slice(0, 255),
      req.ip,
    ]
  );

  return { accessToken, refreshToken };
}

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'user')`,
    [name, email, passwordHash]
  );

  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
  const user = rows[0];
  const tokens = await issueTokens(user, req);

  return ok(
    res,
    { user: publicUser(user), ...tokens },
    'Registration successful',
    201
  );
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  const user = rows[0];

  if (!user || !user.is_active) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    throw new ApiError(401, 'Invalid email or password');
  }

  await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id]);
  const tokens = await issueTokens(user, req);

  return ok(res, { user: publicUser(user), ...tokens }, 'Login successful');
});

// POST /api/auth/refresh
const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    throw new ApiError(401, 'Refresh token required');
  }

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (e) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const tokenHash = hashToken(refreshToken);
  const [rows] = await pool.query(
    `SELECT * FROM refresh_tokens
     WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > NOW()`,
    [tokenHash]
  );
  if (rows.length === 0) {
    throw new ApiError(401, 'Refresh token is no longer valid');
  }

  const [userRows] = await pool.query('SELECT * FROM users WHERE id = ?', [payload.sub]);
  const user = userRows[0];
  if (!user || !user.is_active) {
    throw new ApiError(401, 'Account is not active');
  }

  // Rotate: revoke the old token, issue a new pair.
  await pool.query('UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = ?', [rows[0].id]);
  const tokens = await issueTokens(user, req);

  return ok(res, { user: publicUser(user), ...tokens }, 'Token refreshed');
});

// POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await pool.query(
      'UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = ? AND revoked_at IS NULL',
      [hashToken(refreshToken)]
    );
  }
  return ok(res, null, 'Logged out');
});

// GET /api/auth/me
const me = asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
  if (rows.length === 0) {
    throw new ApiError(404, 'User not found');
  }
  return ok(res, { user: publicUser(rows[0]) }, 'OK');
});

module.exports = { register, login, refresh, logout, me };
