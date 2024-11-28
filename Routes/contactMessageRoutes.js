const express = require("express");
const { isAuthenticated } = require("../middlewares/Auth");
const {
  createContactMessage,
  getUserMessages,
  deleteUserMessages,
  isReadMessage,
} = require("../Controllers/contactMessageController");

const router = express.Router();

router.post("/contact/message/create", isAuthenticated, createContactMessage);
router.get("/contact/messages/get", isAuthenticated, getUserMessages);
router.get("/contact/messages/delete", isAuthenticated, deleteUserMessages);
router.post("/contact/messages/isRead", isAuthenticated, isReadMessage);

module.exports = router;
