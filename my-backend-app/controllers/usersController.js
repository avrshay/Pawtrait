const userService = require("../services/userService");

const { sendSuccess, sendError } = require("../middleware/errorHandler");



async function getAll(req, res) {

  const allUsers = await userService.getAllUsers();

  return sendSuccess(res, allUsers);

}



async function getById(req, res) {

  const id = req.params.id;

  const user = await userService.getUserById(id);

  if (!user) {

    return sendError(res, 404, "NOT_FOUND", "user not found", { id: Number(id) });

  }

  return sendSuccess(res, user);

}



async function newUser(req, res) {

  const { firstName, lastName, email, phone_number, userRole } = req.body;

  const id = await userService.createUser({firstName, lastName, email, phone_number, userRole});
    if (!id) {
    return sendError(res,400,"BAD_REQUEST","Email already exists",{ field: "email" });
  }
  return sendSuccess(res, { userId: id }, 201);

}



async function updateUser(req, res) {

  const id = req.params.id;

  const existing =  await userService.geyUserById(id);

  if (!existing) {

    return sendError(res, 404, "NOT_FOUND", "user not found", { id: Number(id) });

  }

  const { firstName, lastName, email, phone_number, userRole } = req.body;

  await userService.updateById(id,{firstName, lastName, email, phone_number, userRole});

  return sendSuccess(res, { userId: Number(id) });

}



async function updateDetails(req, res) {

  const id = req.params.id;

  const existing = await userService.geyUserById(id);

  if (!existing) {

    return sendError(res, 404, "NOT_FOUND", "user not found", { id: Number(id) });

  }

  const { firstName, lastName, email, phone_number } = req.body;

  await userService.updateDetailsById(id, {firstName, lastName, email, phone_number});

  return sendSuccess(res, { userId: Number(id) });

}



async function deleteUser(req, res) {

  const id = req.params.id;

  const existing =  await userService.geyUserById(id);

  if (!existing) {

    return sendError(res, 404, "NOT_FOUND", "user not found", { id: Number(id) });

  }

   await userService.deleteById(id);

  return sendSuccess(res, { userId: Number(id) });

}



module.exports = { getAll, getById, newUser, updateUser, deleteUser, updateDetails };

