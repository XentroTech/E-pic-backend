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
router.delete(
  "/contact/messages/delete/:id",
  isAuthenticated,
  deleteUserMessages
);
router.post("/contact/messages/isRead/:id", isAuthenticated, isReadMessage);

module.exports = router;
