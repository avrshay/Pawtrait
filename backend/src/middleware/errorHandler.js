// Helper functions to send consistent JSON responses ({ success, data, error })
// from any controller, instead of building the response shape by hand each time.

// Sends a successful response with the given data.
function sendSuccess(res, data, statusCode = 200) {
  const payload = {
    success: true,
    data: data === undefined ? null : data,
    error: null,
  };
  if (res.headersSent) {
    return res;
  }
  return res.status(statusCode).json(payload);
}

// Sends an error response with a status code, error code, message, and extra details.
function sendError(res, statusCode, code, message, details = {}) {
  const d =
    details && typeof details === "object" && !Array.isArray(details) ? details : {};
  const payload = {
    success: false,
    data: null,
    error: {
      code: String(code || "ERROR"),
      message: String(message || "Error"),
      details: d,
    },
  };
  if (res.headersSent) {
    return res;
  }
  return res.status(statusCode).json(payload);
}

module.exports = { sendSuccess, sendError };
