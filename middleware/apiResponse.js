//send a success envelope” / “send an error envelope.
//functions you call when you already have res.

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
