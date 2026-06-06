const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const petImageUploadController = require("../controllers/petImageUploadController");

router.post(
  "/pet-image",
  express.json({ limit: "12mb" }),
  auth.authorize(["user", "admin", "manager"]),
  auth.requireCartUserIdHeader,
  petImageUploadController.uploadPetImage
);

module.exports = router;
