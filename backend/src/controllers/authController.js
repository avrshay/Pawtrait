const userService = require("../services/userService");
const { sendSuccess, sendError } = require("../middleware/errorHandler");

// POST /auth/register — creates a new user account from the request body.
async function register(req, res) {
  const { firstName, lastName, email, phone_number, password } = req.body;
  const user = await userService.RegisterUser({ firstName, lastName, email, phone_number, password });
  if (!user) {
    return sendError(res,400,"BAD_REQUEST","Email already exists",{ field: "email" });
  }
  return sendSuccess(res,user,201);
}

// POST /auth/login — checks email/password and returns the user if they match.
async function login(req, res) {
  const { email, password } = req.body;
  const user = await userService.getUserByEmailAndPassword(email, password);
  if (!user) {
    return sendError(res, 400, "BAD_REQUEST", "Invalid email or password", { field: "credentials" });
  }
  return sendSuccess(res, user);
}

module.exports = { register, login };
