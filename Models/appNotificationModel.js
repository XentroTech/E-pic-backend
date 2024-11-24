const express = require("express");
const Schema = express.Schema;

const appNotificationSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
});

const AppNotification = mongoose.model(
  "AppNotification",
  appNotificationSchema
);

module.express = AppNotification;
