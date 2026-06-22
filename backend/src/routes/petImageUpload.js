// Mounted at /upload in server.js — uploading the customer's pet photo.
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const petImageUploadController = require("../controllers/petImageUploadController");

// Upload a pet image (base64 data URL) and get back its saved URL.
router.post(
  "/pet-image",
  express.json({ limit: "12mb" }),
  auth.authorize(["user", "admin", "manager"]),
  auth.requireCartUserIdHeader,
  petImageUploadController.uploadPetImage
);

module.exports = router;
