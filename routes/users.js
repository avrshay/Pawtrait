const express = require("express");
const router = express.Router();
const usersController= require("../controllers/usersController")
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");

router.get("/",auth.authorize(["admin","manager"]), usersController.getAll);
router.get("/:id",auth.authorizeSelf, usersController.getById);
router.post("/",auth.authorize(["admin","manager"]),validate.validateCreateUser, usersController.newUser);
router.put("/:id",auth.authorize(["admin","manager"]),validate.validateCreateUser, usersController.updateUser);
router.put( "/profile/:id",auth.authorizeSelf,usersController.updateDetails);
router.delete("/:id",auth.authorize(["admin"]), usersController.deleteUser);

module.exports = router;