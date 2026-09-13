// Centralized error handling: every route can just `throw` or call
// `next(err)` and this is the single place that decides what the client
// sees and what gets logged.

function notFound(req, res, next) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.statusCode || err.status || 500;

  // Never leak stack traces or internal details to the client.
  console.error(`[error] ${req.method} ${req.originalUrl} ->`, err.message);
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  const payload = { error: status === 500 ? "Internal server error" : err.message };
  if (process.env.NODE_ENV !== "production" && status === 500) {
    payload.detail = err.message;
  }

  res.status(status).json(payload);
}

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.statusCode = status;
  }
}

module.exports = { notFound, errorHandler, ApiError };
