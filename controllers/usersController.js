const users = require("../models/usersMockData");
const { sendSuccess, sendError } = require("../middleware/errorHandler");

function invalidUserIdParam(id) {
  if (id === undefined || id === null || String(id).trim() === "") {
    return true;
  }
  return !Number.isFinite(Number(id));
}

function getAll(req, res) {
  const allUsers = users.getAllUsers();
  return sendSuccess(res, allUsers);
}

function getById(req, res) {
  const id = req.params.id;
  if (invalidUserIdParam(id)) {
    return sendError(res, 400, "BAD_REQUEST", "invalid user id", { field: "id" });
  }
  const user = users.geyUserById(id);
  if (!user) {
    return sendError(res, 404, "NOT_FOUND", "user not found", { id: Number(id) });
  }
  return sendSuccess(res, user);
}

function newUser(req, res) {
  const { firstName, lastName, userRole } = req.body;
  const id = users.createUser(firstName, lastName, userRole);
  return sendSuccess(res, { userId: id }, 201);
}

function updateUser(req, res) {
  const id = req.params.id;
  if (invalidUserIdParam(id)) {
    return sendError(res, 400, "BAD_REQUEST", "invalid user id", { field: "id" });
  }
  const existing = users.geyUserById(id);
  if (!existing) {
    return sendError(res, 404, "NOT_FOUND", "user not found", { id: Number(id) });
  }
  const { firstName, lastName, userRole } = req.body;
  users.updateById(id, firstName, lastName, userRole);
  return sendSuccess(res, { userId: Number(id) });
}

function updateDetails(req, res) {
  const id = req.params.id;
  if (invalidUserIdParam(id)) {
    return sendError(res, 400, "BAD_REQUEST", "invalid user id", { field: "id" });
  }
  const existing = users.geyUserById(id);
  if (!existing) {
    return sendError(res, 404, "NOT_FOUND", "user not found", { id: Number(id) });
  }
  const {firstName,lastName,email,phone_number} = req.body;
  users.updateDetailsById(id,firstName,lastName,email,phone_number);
  return sendSuccess(res, { userId: Number(id) });
}

function deleteUser(req, res) {
  const id = req.params.id;
  if (invalidUserIdParam(id)) {
    return sendError(res, 400, "BAD_REQUEST", "invalid user id", { field: "id" });
  }
  const existing = users.geyUserById(id);
  if (!existing) {
    return sendError(res, 404, "NOT_FOUND", "user not found", { id: Number(id) });
  }
  users.deleteById(id);
  return sendSuccess(res, { userId: Number(id) });
}

module.exports = { getAll, getById, newUser, updateUser, deleteUser,updateDetails };
