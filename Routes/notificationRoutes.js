const express = require("express");
const { isAuthenticated } = require("../middlewares/Auth");
const {
  sendNotification,
} = require("../Controllers/appNotificationController");
const router = express.Router();

router.post("/user/send-notification", isAuthenticated, sendNotification);

module.exports = router;
