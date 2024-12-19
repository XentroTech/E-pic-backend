const express = require("express");
const { isAuthenticated, authorizeRoles } = require("../middlewares/Auth");
const {
  sendPushNotification,
} = require("../Controllers/pushNotificationController");
const router = express.Router();

router.post(
  "/push/notification/send",
  isAuthenticated,
  // authorizeRoles("admin", "superadmin"),
  sendPushNotification
);
module.exports = router;
