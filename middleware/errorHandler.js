const { sendError } = require("./apiResponse");

function errorHandler(err, req, res, next) {
  if (!err) {
    return next();
  }
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  let code = "INTERNAL_SERVER_ERROR";
  if (status === 404) code = "NOT_FOUND";
  else if (status === 403) code = "FORBIDDEN";
  else if (status === 400) code = "BAD_REQUEST";
  else if (status < 500) code = "BAD_REQUEST";
  return sendError(res, status, code, message, {});
}

module.exports = errorHandler;
