const userService = require("../services/userService");

const { sendSuccess, sendError } = require("../middleware/errorHandler");



// GET /users — returns all users, admin/manager only.
async function getAll(req, res) {

  const allUsers = await userService.getAllUsers();

  return sendSuccess(res, allUsers);

}



// GET /users/:id — returns one user by id (self, admin, or manager).
async function getById(req, res) {

  const id = req.params.id;

  const user = await userService.getUserById(id);

  if (!user) {

    return sendError(res, 404, "NOT_FOUND", "user not found", { id: Number(id) });

  }

  return sendSuccess(res, user);

}



// POST /users — creates a new user, admin/manager only (different from self-registration).
async function newUser(req, res) {

  const { firstName, lastName, email, phone_number, userRole } = req.body;

  const id = await userService.createUser({firstName, lastName, email, phone_number, userRole});
    if (!id) {
    return sendError(res,400,"BAD_REQUEST","Email already exists",{ field: "email" });
  }
  return sendSuccess(res, { userId: id }, 201);

}



// PUT /users/:id — updates any field including userRole, admin/manager only.
async function updateUser(req, res) {

  const id = req.params.id;

  const existing =  await userService.getUserById(id);

  if (!existing) {

    return sendError(res, 404, "NOT_FOUND", "user not found", { id: Number(id) });

  }

  const { firstName, lastName, email, phone_number, userRole } = req.body;

  await userService.updateById(id,{firstName, lastName, email, phone_number, userRole});

  return sendSuccess(res, { userId: Number(id) });

}



// PUT /users/profile/:id — lets a user update their own basic info (no role change).
async function updateDetails(req, res) {

  const id = req.params.id;

  const existing = await userService.getUserById(id);

  if (!existing) {

    return sendError(res, 404, "NOT_FOUND", "user not found", { id: Number(id) });

  }

  const { firstName, lastName, email, phone_number } = req.body;

  await userService.updateDetailsById(id, {firstName, lastName, email, phone_number});

  return sendSuccess(res, { userId: Number(id) });

}



// DELETE /users/:id — removes a user, admin only.
async function deleteUser(req, res) {

  const id = req.params.id;

  const existing =  await userService.getUserById(id);

  if (!existing) {

    return sendError(res, 404, "NOT_FOUND", "user not found", { id: Number(id) });

  }

   await userService.deleteById(id);

  return sendSuccess(res, { userId: Number(id) });

}



module.exports = { getAll, getById, newUser, updateUser, deleteUser, updateDetails };

