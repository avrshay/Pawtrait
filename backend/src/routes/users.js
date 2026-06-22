// Routes mounted at /users in server.js — managing user accounts.
const express = require("express");
const router = express.Router();
const usersController= require("../controllers/usersController")
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");

// List all users — admin/manager only.
router.get("/",auth.authorize(["admin","manager"]), usersController.getAll);
// Get one user — self, admin, or manager.
router.get("/:id", auth.authorizeSelf, validate.validateUserIdParam, usersController.getById);
// Create a user — admin/manager only.
router.post("/",auth.authorize(["admin","manager"]),validate.validateCreateUser, usersController.newUser);
// Update any field of a user, including role — admin/manager only.
router.put("/:id", auth.authorize(["admin","manager"]), validate.validateUserIdParam, validate.validateCreateUser, usersController.updateUser);
// Update your own profile (no role change).
router.put("/profile/:id", auth.authorizeSelf, validate.validateUserIdParam, validate.validateUpdate, usersController.updateDetails);
// Delete a user — admin only.
router.delete("/:id", auth.authorize(["admin"]), validate.validateUserIdParam, usersController.deleteUser);

module.exports = router;