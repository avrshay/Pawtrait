const { sendError } = require("./apiResponse");

function validateCreateUser(req, res, next) {
  const { firstName, lastName, userRole } = req.body;
  if (!firstName || !lastName || typeof firstName !== "string" || typeof lastName !== "string") {
    return sendError(res, 400, "BAD_REQUEST", "Invalid name", { fields: ["firstName", "lastName"] });
  }
  if (!userRole || typeof userRole !== "string" || !["user", "manager", "admin"].includes(userRole)) {
    return sendError(res, 400, "BAD_REQUEST", "Invalid userRole", { field: "userRole" });
  }
  next();
}

function validateRegister(req, res, next) {
  const { firstName, lastName, email, phone_number, password } = req.body;
  if (!firstName || !lastName || typeof firstName !== "string" || typeof lastName !== "string") {
    return sendError(res, 400, "BAD_REQUEST", "Invalid name", { fields: ["firstName", "lastName"] });
  }
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return sendError(res, 400, "BAD_REQUEST", "Invalid Email", { field: "email" });
  }
  if (!phone_number || typeof phone_number !== "string") {
    return sendError(res, 400, "BAD_REQUEST", "Invalid phone number", { field: "phone_number" });
  }
  if (!password || typeof password !== "string" || password.length < 6) {
    return sendError(res, 400, "BAD_REQUEST", "Password must be at least 6 characters", {
      field: "password",
    });
  }
  next();
}

module.exports = { validateCreateUser, validateRegister };
