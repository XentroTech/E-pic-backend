const express = require("express");
const { isAuthenticated } = require("../middlewares/Auth");
const { sendNotification } = require("../Controllers/notificationController");
const router = express.Router();

router.post(" /send-notification", isAuthenticated, sendNotification);

module.exports = router;
