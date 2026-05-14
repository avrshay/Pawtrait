const users = require("../models/usersMockData");
const { sendSuccess, sendError } = require("../middleware/apiResponse");

function getAll(req, res) {
  const allUsers = users.getAllUsers();
  return sendSuccess(res, allUsers);
}

function getById(req, res) {
  const id = req.params.id;
  const user = users.geyUserById(id);
  if (!user) {
    return sendError(res, 404, "NOT_FOUND", "user not found", { id });
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
  const { firstName, lastName, userRole } = req.body;
  users.updateById(id, firstName, lastName, userRole);
  return sendSuccess(res, { userId: id });
}

function deleteUser(req, res) {
  const id = req.params.id;
  users.deleteById(id);
  return sendSuccess(res, { userId: id });
}

module.exports = { getAll, getById, newUser, updateUser, deleteUser };
