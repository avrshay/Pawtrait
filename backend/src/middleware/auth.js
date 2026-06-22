const { sendError } = require("./errorHandler");
const userService = require("../services/userService");

// Express middleware factory: blocks the request unless x-user-role header is one of allowedRoles.
function authorize(allowedRoles) {
  return (req, res, next) => {
    const role = req.headers["x-user-role"];

    if (!role || !allowedRoles.includes(role)) {
      return sendError(res, 403, "FORBIDDEN", "You do not have permission to perform this action.", {});
    }
    next();
  };
}

// Express middleware: allows the request if it's an admin/manager, or if the logged-in user
// (x-user-id header) is the same as the :id in the route.
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
async function requireCartUserIdHeader(req, res, next) {
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
  if (!await userService.getUserById(uid)) {
    return sendError(res, 404, "NOT_FOUND", "no user with that id", { field: "x-user-id", userId: uid });
  }
  next();
}

module.exports = { authorize, authorizeSelf, requireCartUserIdHeader };
