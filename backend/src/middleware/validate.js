const { sendError } = require("./errorHandler");

const validateCartItemIdParam = validateParamId("item_id", "invalid item_id");
const validateUserIdParam = validateParamId("id", "invalid user id");
const validateUserIdParamMin1 = validateParamId("id", "invalid user id", { min: 1 });
const validateProductIdParam = validateParamId("product_id", "invalid product_id");


// Checks the value is a string that isn't empty/just whitespace.
function isNonEmptyString(value) {
  if (value == null) {
    return false;
  }
  return typeof value === "string" && value.trim() !== "";
}

// Checks the value is a number that's at least min (default 1).
function isPositiveNumber(value, min = 1) {
  const n = Number(value);
  return Number.isFinite(n) && n >= min;
}

// Checks the value can be turned into a valid number (used for ids).
function isNumericId(value) {
  if (value === undefined || value === null || String(value).trim() === "") {
    return false;
  }
  return Number.isFinite(Number(value));
}

// Shortcut for sending a 400 BAD_REQUEST error response.
function badRequest(res, message, details) {
  return sendError(res, 400, "BAD_REQUEST", message, details);
}

/** Express middleware: numeric route param (e.g. :id, :item_id). */
function validateParamId(paramName, message, options = {}) {
  const min = options.min;
  return (req, res, next) => {
    const value = req.params[paramName];
    if (!isNumericId(value)) {
      return badRequest(res, message || `invalid ${paramName}`, { field: paramName });
    }
    if (min != null && Number(value) < min) {
      return badRequest(res, message || `invalid ${paramName}`, { field: paramName });
    }
    next();
  };
}

/** Express middleware: body field must be a positive number. */
function validateBodyPositiveNumber(field, message) {
  return (req, res, next) => {
    const value = (req.body || {})[field];
    if (!isPositiveNumber(value)) {
      return badRequest(res, message || `${field} must be a positive number`, { field });
    }
    next();
  };
}

/** Express middleware: body field must be a non-empty string. */
function validateBodyNonEmptyString(field, message) {
  return (req, res, next) => {
    const raw = (req.body || {})[field];
    const value = raw != null ? String(raw).trim() : "";
    if (!value) {
      return badRequest(res, message || `${field} is required`, { field });
    }
    next();
  };
}

/** Express middleware: body field must be a numeric id. */
function validateBodyNumericId(field, message) {
  return (req, res, next) => {
    const value = (req.body || {})[field];
    if (!isNumericId(value)) {
      return badRequest(res, message || `invalid ${field}`, { field });
    }
    next();
  };
}

// validate the cart add item
function validateCartAddItem(req, res, next) {
  const body = req.body || {};
  if (!isNumericId(body.productId)) {
    return badRequest(res, "productId is required", { field: "productId" });
  }
  if (!isPositiveNumber(body.quantity)) {
    return badRequest(res, "quantity must be a positive number", { field: "quantity" });
  }
  const pet = body.petImageUrl != null ? String(body.petImageUrl).trim() : "";
  if (!pet) {
    return badRequest(res, "petImageUrl is required for each cart line", { field: "petImageUrl" });
  }
  next();
}

// validate the quantity of the cart item
function validateCartUpdateQuantity(req, res, next) {
  const body = req.body || {};
  if (!isPositiveNumber(body.quantity)) {
    return badRequest(res, "body must include quantity (positive number)", { field: "quantity" });
  }
  next();
}

// validate the order route params
function validateOrderRouteParams(req, res, next) {
  if (!isNumericId(req.params.id)) {
    return badRequest(res, "invalid user id", { field: "id" });
  }
  if (!isNumericId(req.params.orderId)) {
    return badRequest(res, "invalid order id", { field: "orderId" });
  }
  next();
}

// Express middleware: checks all required fields for creating a user (admin/manager flow).
function validateCreateUser(req, res, next) {
  const { firstName, lastName,email, phone_number, userRole } = req.body;
  if (!isNonEmptyString(firstName) || !isNonEmptyString(lastName)) {
    return badRequest(res, "Invalid name", { fields: ["firstName", "lastName"] });
  }
    if (!email || typeof email !== "string" || !email.includes("@")) {
    return badRequest(res, "Invalid Email", { field: "email" });
  }
  if (!/^\d{10}$/.test(phone_number || "")) {
    return badRequest(res, "Phone number must contain exactly 10 digits", { field: "phone_number" });
  }
  if (!userRole || typeof userRole !== "string" || !["user", "manager", "admin"].includes(userRole)) {
    return badRequest(res, "Invalid userRole", { field: "userRole" });
  }
  next();
}

// Express middleware: checks all required fields for self-registration (with password).
function validateRegister(req, res, next) {
  const { firstName, lastName, email, phone_number, password } = req.body;
  if (!isNonEmptyString(firstName) || !isNonEmptyString(lastName)) {
    return badRequest(res, "Invalid name", { fields: ["firstName", "lastName"] });
  }
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return badRequest(res, "Invalid Email", { field: "email" });
  }
  if (!isNonEmptyString(phone_number)) {
    return badRequest(res, "Invalid phone number", { field: "phone_number" });
  }
  if (!password || typeof password !== "string" || password.length < 6) {
    return badRequest(res, "Password must be at least 6 characters", { field: "password" });
  }
  next();
}

// Express middleware: checks fields when a user updates their own profile (no password/role).
function validateUpdate(req, res, next) {
  const { firstName, lastName, email, phone_number } = req.body;
  if (!isNonEmptyString(firstName) || !isNonEmptyString(lastName)) {
    return badRequest(res, "Invalid name", { fields: ["firstName", "lastName"] });
  }
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return badRequest(res, "Invalid Email", { field: "email" });
  }
  if (!isNonEmptyString(phone_number)) {
    return badRequest(res, "Invalid phone number", { field: "phone_number" });
  }
  next();
}

// Express middleware: checks email and password are present before attempting login.
function validateLogin(req, res, next) {
  const { email, password } = req.body;
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return badRequest(res, "Invalid Email", { field: "email" });
  }
  if (!password || typeof password !== "string" || password.length < 6) {
    return badRequest(res, "Password must be at least 6 characters", { field: "password" });
  }
  next();
}

module.exports = {
  isNonEmptyString,
  isPositiveNumber,
  isNumericId,
  validateParamId,
  validateBodyPositiveNumber,
  validateBodyNonEmptyString,
  validateBodyNumericId,
  validateCartAddItem,
  validateCartUpdateQuantity,
  validateCartItemIdParam,
  validateUserIdParam,
  validateUserIdParamMin1,
  validateProductIdParam,
  validateOrderRouteParams,
  validateCreateUser,
  validateRegister,
  validateUpdate,
  validateLogin,
};
