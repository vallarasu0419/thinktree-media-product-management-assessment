// Wraps async route handlers so thrown errors reach the error middleware.
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Consistent success/error envelope: { success, data, message }.
const ok = (res, data = null, message = 'OK', status = 200) =>
  res.status(status).json({ success: true, data, message });

const fail = (res, message = 'Error', status = 400, data = null) =>
  res.status(status).json({ success: false, data, message });

// Simple app error with an HTTP status code.
class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

module.exports = { asyncHandler, ok, fail, ApiError };
