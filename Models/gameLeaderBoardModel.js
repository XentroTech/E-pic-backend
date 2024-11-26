const mongoose = require("mongoose");

const gameLeaderBoardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  duration: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  rank: { type: String },
});

const GameLeaderBoard = mongoose.model(
  "GameLeaderBoard",
  gameLeaderBoardSchema
);
module.exports = GameLeaderBoard;
