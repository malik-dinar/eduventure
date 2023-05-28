const express = require("express");
const validateToken = require("../middleware/validateToken");
const {
  newConversation,
  getConversation,
  newMessage,
  getMessages,
} = require("../controllers/chatController");

const router = express.Router();

router.post("/", newConversation);
router.get("/:userId", getConversation);

router.post("/message", newMessage);
router.get("/message/:conversationId", getMessages);

module.exports = router;
