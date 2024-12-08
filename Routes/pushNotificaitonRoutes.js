const express = require("express");
const { isAuthenticated } = require("../middlewares/Auth");
const {
  sendPushNotification,
} = require("../Controllers/pushNotificationController");
const router = express.Router();

router.post("/push/notification/send", isAuthenticated, sendPushNotification);
module.exports = router;
