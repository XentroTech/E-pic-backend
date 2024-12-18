const express = require("express");
const { isAuthenticated } = require("../middlewares/Auth");
const {
  sendNotification,
  getUserNotifications,
  notificationSeenUnseen,
} = require("../Controllers/appNotificationController");
const router = express.Router();

router.post("/notification/send", isAuthenticated, sendNotification);
router.get("/notification/user/:id", isAuthenticated, getUserNotifications);
router.post(
  "/notification/seenUnseen/:id",
  isAuthenticated,
  notificationSeenUnseen
);

module.exports = router;
