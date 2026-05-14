const { sendError } = require("./apiResponse");
const users = require("../models/usersMockData");

function authorize(allowedRoles) {
  return (req, res, next) => {
    const role = req.headers["x-user-role"];

    if (!role || !allowedRoles.includes(role)) {
      return sendError(res, 403, "FORBIDDEN", "You do not have permission to perform this action.", {});
    }
    next();
  };
}

function authorizeSelf(req, res, next) {
  const role = req.headers["x-user-role"];
  if (["admin", "manager"].includes(role)) {
    return next();
  }
  const userId = Number(req.headers["x-user-id"]);
  const targetId = Number(req.params.id);
  if (userId === targetId) {
    return next();
  }
  return sendError(res, 403, "FORBIDDEN", "You do not have permission to perform this action.", {});
}

/**
 * Cart owner from x-user-id.
 * - admin/manager: only require a finite numeric header (no user-table check).
 * - user: must be positive integer and exist in users mock.
 */
function requireCartUserIdHeader(req, res, next) {
  const uid = Number(req.headers["x-user-id"]);
  if (!Number.isFinite(uid)) {
    return sendError(res, 400, "BAD_REQUEST", "x-user-id header is required (numeric cart owner)", {
      field: "x-user-id",
    });
  }

  const role = req.headers["x-user-role"];
  if (["admin", "manager"].includes(role)) {
    return next();
  }

  if (!Number.isInteger(uid) || uid < 1) {
    return sendError(res, 400, "BAD_REQUEST", "x-user-id must be a positive integer", {
      field: "x-user-id",
      value: uid,
    });
  }
  if (!users.geyUserById(uid)) {
    return sendError(res, 404, "NOT_FOUND", "no user with that id", { field: "x-user-id", userId: uid });
  }
  next();
}

module.exports = { authorize, authorizeSelf, requireCartUserIdHeader };
