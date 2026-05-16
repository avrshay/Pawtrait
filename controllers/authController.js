const users = require("../models/usersMockData");
const { sendSuccess, sendError } = require("../middleware/errorHandler");

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
    return sendError(res, 400, "BAD_REQUEST", "Invalid email or password", { field: "credentials" });
  }
  return sendSuccess(res, user);
}

module.exports = { register, login };
