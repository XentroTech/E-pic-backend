const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  activityType: { type: String, required: true }, // e.g., 'photo_upload', 'purchase', 'competition_participation'
  description: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const ActivityLog = mongoose.model("ActivityLog", activitySchema);
module.exports = ActivityLog;
