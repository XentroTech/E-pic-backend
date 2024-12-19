const express = require("express");
const { isAuthenticated, authorizeRoles } = require("../middlewares/Auth");
const {
  createContactMessage,
  getUserMessages,
  deleteUserMessages,
  isReadMessage,
} = require("../Controllers/contactMessageController");

const router = express.Router();

router.post("/contact/message/create", isAuthenticated, createContactMessage);
router.get(
  "/contact/messages/get",
  isAuthenticated,
  // authorizeRoles("admin", "superadmin"),
  getUserMessages
);
router.delete(
  "/contact/messages/delete/:id",
  isAuthenticated,
  // authorizeRoles("admin", "superadmin"),
  deleteUserMessages
);
router.post("/contact/messages/isRead/:id", isAuthenticated, isReadMessage);

module.exports = router;
