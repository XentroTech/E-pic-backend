const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const competitionSchema = new Schema({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now() },
  country: { type: String, required: true },
});

const Competition = mongoose.model("Competition", competitionSchema);
module.exports = Competition;
