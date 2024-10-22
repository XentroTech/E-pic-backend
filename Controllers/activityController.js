const express = require("express");
const router = express.Router();
const ActivityLog = require("../models/ActivityLog");

// Log a new activity
exports.logNewActivity = catchAsyncErrors(async (req, res) => {
  const { activityType, description } = req.body;
  try {
    const newActivity = new ActivityLog({
      userId: req.params.userId,
      activityType,
      description,
    });

    await newActivity.save();
    res
      .status(200)
      .json({ message: "Activity logged successfully", newActivity });
  } catch (error) {
    res.status(500).json({ message: "Error logging activity", error });
  }
});

// View user activity log
exports.getUserActivityLog = catchAsyncErrors(async (req, res) => {
  try {
    const activities = await ActivityLog.find({
      userId: req.params.userId,
    }).sort({ timestamp: -1 });
    if (!activities.length)
      return res.status(404).json({ message: "No activities found" });

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching activity log", error });
  }
});

module.exports = router;
