const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  gameTime: { type: Number, default: 30 },
});

module.exports = mongoose.model("Game", gameSchema);
