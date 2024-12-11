const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdRewardSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  adCount: { type: Number, required: true },
  awardedCoin: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  country: { type: String, required: true },
});

const AdReward = mongoose.model("AdReward", AdRewardSchema);
module.exports = AdReward;
