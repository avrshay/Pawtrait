const express = require("express");
const router = express.Router();
const authController= require("../controllers/usersController")

router.get("/", authController.getAll);
router.get("/:id", authController.getById);
router.post("/", authController.login);
router.put("/:id", authController.login);
router.delete("/:id", authController.login);

module.exports = router;