const { verifyAccessToken } = require('../utils/tokens');
const { fail } = require('../utils/helpers');

// Requires a valid Bearer access token; attaches req.user.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return fail(res, 'Authentication required', 401);
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      name: payload.name,
    };
    return next();
  } catch (err) {
    return fail(res, 'Invalid or expired token', 401);
  }
}

// Restricts a route to the given roles.
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return fail(res, 'You do not have permission to perform this action', 403);
    }
    return next();
  };
}

module.exports = { requireAuth, requireRole };
