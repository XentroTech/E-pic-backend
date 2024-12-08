const { Timestamp } = require("firebase-admin/firestore");
const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  gameTime: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now() },
  country: { type: String, required: true },
});

module.exports = mongoose.model("Game", gameSchema);
