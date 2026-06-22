// Mounted at /chat in server.js — talking to the AI assistant.
const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// Send a chat message and get the AI's reply.
router.post("/message", chatController.sendMessage);

module.exports = router;
