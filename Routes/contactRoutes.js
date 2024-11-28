const express = require("express");
const { isAuthenticated } = require("../middlewares/Auth");
const {
  createContactMessage,
  getUserMessages,
  deleteUserMessages,
} = require("../Controllers/contactController");

const router = express.Router();

router.post("/contact/message/create", isAuthenticated, createContactMessage);
router.get("/contact/messages/get", isAuthenticated, getUserMessages);
router.get("/contact/messages/delete", isAuthenticated, deleteUserMessages);

module.exports = router;
