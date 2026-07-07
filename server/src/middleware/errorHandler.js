const env = require('../config/env');

function notFound(req, res) {
  res.status(404).json({ success: false, data: null, message: 'Route not found' });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || (err.name === 'MulterError' ? 400 : 500);
  const message = err.message || 'Internal server error';

  // Friendly message for duplicate unique keys (email, sku, slug, ...).
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      data: null,
      message: 'A record with this value already exists',
    });
  }

  if (env.nodeEnv !== 'production' && status === 500) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(status).json({
    success: false,
    data: null,
    message,
  });
}

module.exports = { notFound, errorHandler };
