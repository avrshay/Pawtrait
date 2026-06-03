const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const petImageUploadController = require("../controllers/petImageUploadController");

// Larger JSON limit only for this route (base64 image from the browser).
router.post(
  "/pet-image",
  express.json({ limit: "12mb" }),
  auth.authorize(["user", "admin", "manager"]),
  auth.requireCartUserIdHeader,
  petImageUploadController.uploadPetImage
);

module.exports = router;
