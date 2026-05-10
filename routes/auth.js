const express = require("express");
const router = express.Router();
const authController= require("../controllers/authController")
const validate = require("../middleware/validate");

router.post("/register",validate.validateRegister, authController.register);
router.post("/login", authController.login);

module.exports = router;