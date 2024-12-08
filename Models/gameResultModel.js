const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameResultSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  imageId: { type: mongoose.Schema.Types.ObjectId, ref: "Image" },
  duration: { type: Number },
  createdAt: { type: Date, default: Date.now() },
  country: { type: String },
});

const GameResult = mongoose.model("GameResult", gameResultSchema);
module.exports = GameResult;
