const express = require("express");
const { isAuthenticated } = require("../middlewares/Auth");
const {
  createContactMessage,
  getUserMessages,
} = require("../Controllers/contactController");

const router = express.Router();

router.post("/user/contact/create", isAuthenticated, createContactMessage);
router.get("/user/contact/messages", isAuthenticated, getUserMessages);

module.exports = router;
