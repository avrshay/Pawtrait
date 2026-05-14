const users = require("../models/usersMockData");
const { sendSuccess, sendError } = require("../middleware/apiResponse");

function register(req, res) {
  const { firstName, lastName, email, phone_number, password } = req.body;
  users.RegisterUser(firstName, lastName, email, phone_number, password);
  return sendSuccess(
    res,
    { firstName, lastName },
    201
  );
}

function login(req, res) {
  const { email, password } = req.body;
  const user = users.getUserByEmailAndPassword(email, password);
  if (!user) {
    return sendError(res, 404, "NOT_FOUND", "Invalid details", { field: "credentials" });
  }
  return sendSuccess(res, user);
}

module.exports = { register, login };
