const express = require("express");
const {
  logNewActivity,
  getUserActivityLog,
} = require("../Controllers/activityController");

const router = express.Router();

router.post("/log-activity/:userId", logNewActivity);

router.get("/activity-log/:userId", getUserActivityLog);

module.exports = router;
