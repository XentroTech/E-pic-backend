const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appNotificationSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isSeen: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now() },
  country: { type: String, required: true },
  senderImage: { type: String, default: "" },
});

const AppNotification = mongoose.model(
  "AppNotification",
  appNotificationSchema
);

module.exports = AppNotification;
