// Routes mounted at /auth in server.js — register and login.
const express = require("express");
const router = express.Router();
const authController= require("../controllers/authController")
const validate = require("../middleware/validate");

// Create a new account.
router.post("/register",validate.validateRegister, authController.register);
// Log in with email + password.
router.post("/login",validate.validateLogin, authController.login);

module.exports = router;